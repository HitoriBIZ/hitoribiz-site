"use client";

import {
  ChangeEvent,
  MouseEvent,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Mode = "edit" | "performance";
type MovementLabel = "I" | "II" | "III" | "IV";

type MovementBookmark = {
  id: string;
  label: MovementLabel;
  title: string;
  pageNumber: number;
};

type PlacedSymbol = {
  id: string;
  page: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

type ScoreItem = {
  id: string;
  title: string;
  fileName: string;
  totalPages: number;
  currentPage: number;
  movements: MovementBookmark[];
  symbols: PlacedSymbol[];
  // PDF本体はバックアップ書き出し・復元・記号付きPDF出力に使います。
  // localStorageには保存せず、必要なときだけ .score-reader.json に含めます。
  pdfDataUrl?: string;
};

type ScoreReaderBackup = {
  app: "Orchestra Score Reader";
  version: 1;
  exportedAt: string;
  activeScoreId: string | null;
  symbolSize: number;
  symbolColor: string;
  scores: ScoreItem[];
};

type PdfDocumentLike = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<any>;
  destroy?: () => Promise<void>;
};

const DEFAULT_SYMBOL_SIZE = 12;
const DEFAULT_TOTAL_PAGES = 1;

const DEFAULT_MOVEMENTS: MovementBookmark[] = [
  { id: "movement-1", label: "I", title: "第1楽章", pageNumber: 1 },
  { id: "movement-2", label: "II", title: "第2楽章", pageNumber: 1 },
  { id: "movement-3", label: "III", title: "第3楽章", pageNumber: 1 },
  { id: "movement-4", label: "IV", title: "第4楽章", pageNumber: 1 },
];

const PALETTE_GROUPS = [
  { title: "指番号", items: ["1", "2", "3", "4", "0"] },
  {
    title: "弦指定",
    items: ["G", "D", "A", "E", "sul G", "sul D", "sul A", "sul E"],
  },
  {
    title: "強弱",
    items: ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff", "sfz", "fp"],
  },
  {
    title: "奏法",
    items: [
      "arco",
      "pizz.",
      "div.",
      "unis.",
      "solo",
      "tutti",
      "trem.",
      "ord.",
      "con sord.",
      "senza sord.",
    ],
  },
  { title: "ボウイング", items: ["∨", "Π", "↑", "↓", "→", "←", "↗", "↘"] },
  {
    title: "表情・速度",
    items: [
      "cresc.",
      "dim.",
      "rit.",
      "accel.",
      "a tempo",
      "dolce",
      "cantabile",
      "espress.",
    ],
  },
  {
    title: "リハーサル",
    items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  },
  { title: "チェック", items: ["✓", "○", "×", "★", "※", "!", "?", "要確認"] },
];

const SYMBOL_COLORS = [
  { label: "黒", value: "#000000" },
  { label: "赤", value: "#dc2626" },
  { label: "青", value: "#2563eb" },
  { label: "緑", value: "#16a34a" },
  { label: "橙", value: "#ea580c" },
  { label: "紫", value: "#7c3aed" },
];

const STORAGE_KEYS = {
  scoresMeta: "orchestra-score-reader-app-scores-meta",
  activeScoreId: "orchestra-score-reader-app-active-score-id",
  symbolSize: "orchestra-score-reader-app-symbol-size",
  symbolColor: "orchestra-score-reader-app-symbol-color",
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cloneDefaultMovements(): MovementBookmark[] {
  return DEFAULT_MOVEMENTS.map((movement) => ({ ...movement }));
}

function stripPdfData(scores: ScoreItem[]) {
  return scores.map(({ pdfDataUrl, ...score }) => score);
}

function createDownloadFileName(baseName: string, extension: string) {
  const safeBaseName = (baseName || "score-reader")
    .replace(/\.[^/.]+$/, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80);

  const date = new Date().toISOString().slice(0, 10);
  return `${safeBaseName}-${date}.${extension}`;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function arrayBufferToDataUrl(buffer: ArrayBuffer, mimeType = "application/pdf") {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...Array.from(chunk));
  }

  return `data:${mimeType};base64,${window.btoa(binary)}`;
}

async function dataUrlToUint8Array(dataUrl: string) {
  const response = await fetch(dataUrl);
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

function toRgb01(hexColor: string) {
  const fallback = { r: 0, g: 0, b: 0 };
  const match = /^#?([0-9a-f]{6})$/i.exec(hexColor || "");
  if (!match) return fallback;

  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255,
  };
}

function makePdfSafeText(text: string) {
  return text.replace(/[^\x20-\x7E]/g, "?");
}

export default function ScoreReaderAppPage() {
  const pdfDocsRef = useRef<Record<string, PdfDocumentLike>>({});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scorePageRef = useRef<HTMLDivElement | null>(null);
  const scoreViewportRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const backupInputRef = useRef<HTMLInputElement | null>(null);

  const dragMovedRef = useRef(false);
  const performancePointerStartRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const didSwipeRef = useRef(false);

  const [mode, setMode] = useState<Mode>("edit");
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [activeScoreId, setActiveScoreId] = useState<string | null>(null);

  const [previousLocation, setPreviousLocation] = useState<{
    scoreId: string;
    page: number;
  } | null>(null);

  const [pageInput, setPageInput] = useState("1");

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>("1");
  const [symbolSize, setSymbolSize] = useState(DEFAULT_SYMBOL_SIZE);
  const [symbolColor, setSymbolColor] = useState("#000000");

  const [showNavigator, setShowNavigator] = useState(true);
  const [selectedPlacedSymbolId, setSelectedPlacedSymbolId] = useState<
    string | null
  >(null);
  const [draggingSymbolId, setDraggingSymbolId] = useState<string | null>(null);

  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isBackupWorking, setIsBackupWorking] = useState(false);
  const [renderRevision, setRenderRevision] = useState(0);

  const activeScore = useMemo(() => {
    return scores.find((score) => score.id === activeScoreId) ?? null;
  }, [scores, activeScoreId]);

  const activeScoreIndex = useMemo(() => {
    return scores.findIndex((score) => score.id === activeScoreId);
  }, [scores, activeScoreId]);

  const currentPage = activeScore?.currentPage ?? 1;
  const totalPages = activeScore?.totalPages ?? DEFAULT_TOTAL_PAGES;
  const currentSymbols = activeScore?.symbols ?? [];
  const currentMovements = activeScore?.movements ?? cloneDefaultMovements();

  const selectedPlacedSymbol = useMemo(() => {
    if (!activeScore) return null;
    return (
      activeScore.symbols.find((item) => item.id === selectedPlacedSymbolId) ??
      null
    );
  }, [activeScore, selectedPlacedSymbolId]);

  const currentMovement = useMemo(() => {
    const sorted = [...currentMovements].sort(
      (a, b) => a.pageNumber - b.pageNumber
    );

    let found = sorted[0];

    for (const movement of sorted) {
      if (currentPage >= movement.pageNumber) {
        found = movement;
      }
    }

    return found;
  }, [currentPage, currentMovements]);

  const visibleThumbPages = useMemo(() => {
    const start = Math.max(1, currentPage - 8);
    const end = Math.min(totalPages, currentPage + 8);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  const currentPageSymbols = useMemo(() => {
    return currentSymbols.filter((item) => item.page === currentPage);
  }, [currentSymbols, currentPage]);

  useEffect(() => {
    const savedScoresMeta = localStorage.getItem(STORAGE_KEYS.scoresMeta);
    const savedActiveScoreId = localStorage.getItem(STORAGE_KEYS.activeScoreId);
    const savedSymbolSize = localStorage.getItem(STORAGE_KEYS.symbolSize);
    const savedSymbolColor = localStorage.getItem(STORAGE_KEYS.symbolColor);

    if (savedScoresMeta) {
      try {
        const parsed = JSON.parse(savedScoresMeta) as ScoreItem[];
        setScores(parsed);
      } catch {
        setScores([]);
      }
    }

    if (savedActiveScoreId) {
      setActiveScoreId(savedActiveScoreId);
    }

    if (savedSymbolSize) {
      const parsedSize = Number(savedSymbolSize);
      if (Number.isFinite(parsedSize)) {
        setSymbolSize(parsedSize);
      }
    }

    if (savedSymbolColor) {
      setSymbolColor(savedSymbolColor);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.scoresMeta,
      JSON.stringify(stripPdfData(scores))
    );
  }, [scores]);

  useEffect(() => {
    if (activeScoreId) {
      localStorage.setItem(STORAGE_KEYS.activeScoreId, activeScoreId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeScoreId);
    }
  }, [activeScoreId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.symbolSize, String(symbolSize));
  }, [symbolSize]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.symbolColor, symbolColor);
  }, [symbolColor]);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  useEffect(() => {
    function clampPosition(value: number) {
      return Math.max(0, Math.min(100, value));
    }

    function isTextInputTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;

      const tagName = target.tagName.toLowerCase();

      return (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTextInputTarget(event.target)) {
        return;
      }

      if (event.key === "Enter" || event.key === "Escape") {
        setSelectedPlacedSymbolId(null);
        setDraggingSymbolId(null);
        dragMovedRef.current = false;
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedPlacedSymbolId) {
          event.preventDefault();

          updateActiveScore((score) => ({
            ...score,
            symbols: score.symbols.filter(
              (item) => item.id !== selectedPlacedSymbolId
            ),
          }));

          setSelectedPlacedSymbolId(null);
          setDraggingSymbolId(null);
        }

        return;
      }

      const isArrowKey =
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight";

      // 編集モード：選択中の記号を矢印キーで微調整
      if (mode === "edit" && selectedPlacedSymbolId && isArrowKey) {
        event.preventDefault();

        // 通常：細かく移動
        // Shift + 矢印：大きく移動
        // Alt + 矢印：さらに細かく移動
        const step = event.shiftKey ? 1 : event.altKey ? 0.1 : 0.25;

        const deltaX =
          event.key === "ArrowLeft"
            ? -step
            : event.key === "ArrowRight"
              ? step
              : 0;

        const deltaY =
          event.key === "ArrowUp"
            ? -step
            : event.key === "ArrowDown"
              ? step
              : 0;

        updateActiveScore((score) => ({
          ...score,
          symbols: score.symbols.map((item) =>
            item.id === selectedPlacedSymbolId
              ? {
                  ...item,
                  x: clampPosition(item.x + deltaX),
                  y: clampPosition(item.y + deltaY),
                }
              : item
          ),
        }));

        return;
      }

      // 本番モード：左右キーでページ送り
      if (mode === "performance") {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goToNextPage();
          return;
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToPreviousPage();
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPlacedSymbolId, activeScoreId, mode, scores, activeScore]);

  useEffect(() => {
    return () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }

      Object.values(pdfDocsRef.current).forEach((doc) => {
        if (doc.destroy) {
          doc.destroy().catch(() => {
            // ignore
          });
        }
      });
    };
  }, []);

  function updateActiveScore(updater: (score: ScoreItem) => ScoreItem) {
    if (!activeScoreId) return;

    setScores((prev) =>
      prev.map((score) => (score.id === activeScoreId ? updater(score) : score))
    );
  }

  function clampPage(pageNumber: number, maxPages = totalPages) {
    return Math.min(Math.max(pageNumber, 1), maxPages);
  }

  function enterPerformanceMode() {
    if (!activeScore) return;

    setMode("performance");
    setShowNavigator(false);
    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
    dragMovedRef.current = false;
  }

  function exitPerformanceMode() {
    setMode("edit");
    setShowNavigator(true);
    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
    dragMovedRef.current = false;
  }

  function getPointerPositionOnScorePage(event: {
    clientX: number;
    clientY: number;
  }) {
    const scorePage = scorePageRef.current;
    if (!scorePage) return { x: 50, y: 50 };

    const rect = scorePage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    return {
      x: Math.min(Math.max(x, 0), 100),
      y: Math.min(Math.max(y, 0), 100),
    };
  }

  async function handlePdfUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setIsPdfLoading(true);
    setPdfError(null);

    try {
      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

      const newScores: ScoreItem[] = [];

      for (const file of files) {
        if (file.type !== "application/pdf") continue;

        const arrayBuffer = await file.arrayBuffer();
        const pdfDataUrl = arrayBufferToDataUrl(arrayBuffer, file.type);

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });

        const pdfDocument = await loadingTask.promise;
        const scoreId = createId("score");

        pdfDocsRef.current[scoreId] = pdfDocument;

        const title = file.name.replace(/\.pdf$/i, "");

        newScores.push({
          id: scoreId,
          title,
          fileName: file.name,
          totalPages: pdfDocument.numPages,
          currentPage: 1,
          movements: cloneDefaultMovements(),
          symbols: [],
          pdfDataUrl,
        });
      }

      if (newScores.length === 0) {
        setPdfError("PDFファイルを選択してください。");
        return;
      }

      setScores((prev) => [...prev, ...newScores]);

      if (!activeScoreId) {
        setActiveScoreId(newScores[0].id);
      }

      setSelectedPlacedSymbolId(null);
      setDraggingSymbolId(null);
      setRenderRevision((value) => value + 1);
    } catch (error) {
      console.error(error);
      setPdfError(
        "PDFの読み込みに失敗しました。別のPDFで試すか、ファイルサイズを確認してください。"
      );
    } finally {
      setIsPdfLoading(false);
      event.target.value = "";
    }
  }

  useEffect(() => {
    async function renderCurrentPage() {
      if (
        !activeScoreId ||
        !pdfDocsRef.current[activeScoreId] ||
        !canvasRef.current ||
        !scoreViewportRef.current
      ) {
        return;
      }

      setIsPageRendering(true);
      setPdfError(null);

      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore
          }
        }

        const pdfDoc = pdfDocsRef.current[activeScoreId];
        const page = await pdfDoc.getPage(currentPage);

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
          setPdfError("Canvasを初期化できませんでした。");
          return;
        }

        const viewportBox = scoreViewportRef.current;
        const availableWidth = Math.max(viewportBox.clientWidth - 8, 360);
        const availableHeight = Math.max(viewportBox.clientHeight - 8, 520);

        const baseViewport = page.getViewport({ scale: 1 });
        const widthScale = availableWidth / baseViewport.width;
        const heightScale = availableHeight / baseViewport.height;

        const maxScale = mode === "performance" ? 4.5 : 2.8;

        const visualScale =
          mode === "performance"
            ? Math.min(widthScale, maxScale)
            : Math.min(widthScale, heightScale, maxScale);

        const viewport = page.getViewport({ scale: visualScale });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);

        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(outputScale, 0, 0, outputScale, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (error: any) {
        if (error?.name !== "RenderingCancelledException") {
          console.error(error);
          setPdfError("ページの描画に失敗しました。");
        }
      } finally {
        setIsPageRendering(false);
      }
    }

    renderCurrentPage();
  }, [activeScoreId, currentPage, totalPages, mode, renderRevision]);

  useEffect(() => {
    async function preloadNeighborPages() {
      if (!activeScoreId) return;

      const pdfDoc = pdfDocsRef.current[activeScoreId];
      if (!pdfDoc) return;

      const targets = [currentPage - 1, currentPage + 1, currentPage + 2].filter(
        (page) => page >= 1 && page <= totalPages
      );

      await Promise.allSettled(
        targets.map((pageNumber) => pdfDoc.getPage(pageNumber))
      );
    }

    preloadNeighborPages();
  }, [activeScoreId, currentPage, totalPages]);

  function goToPage(pageNumber: number) {
    if (!activeScore) return;

    const safePage = clampPage(pageNumber, activeScore.totalPages);
    if (safePage === activeScore.currentPage) return;

    setPreviousLocation({
      scoreId: activeScore.id,
      page: activeScore.currentPage,
    });

    updateActiveScore((score) => ({
      ...score,
      currentPage: safePage,
    }));

    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function goToPreviousPage() {
    if (!activeScore) return;

    if (activeScore.currentPage > 1) {
      goToPage(activeScore.currentPage - 1);
      return;
    }

    goToPreviousScore();
  }

  function goToNextPage() {
    if (!activeScore) return;

    if (activeScore.currentPage < activeScore.totalPages) {
      goToPage(activeScore.currentPage + 1);
      return;
    }

    goToNextScore();
  }

  function goToPreviousScore() {
    if (scores.length === 0 || activeScoreIndex <= 0) return;

    const previousScore = scores[activeScoreIndex - 1];

    if (activeScore) {
      setPreviousLocation({
        scoreId: activeScore.id,
        page: activeScore.currentPage,
      });
    }

    setActiveScoreId(previousScore.id);
    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function goToNextScore() {
    if (scores.length === 0 || activeScoreIndex < 0) return;
    if (activeScoreIndex >= scores.length - 1) return;

    const nextScore = scores[activeScoreIndex + 1];

    if (activeScore) {
      setPreviousLocation({
        scoreId: activeScore.id,
        page: activeScore.currentPage,
      });
    }

    setActiveScoreId(nextScore.id);
    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function backToPreviousLocation() {
    if (!previousLocation) return;

    const target = scores.find((score) => score.id === previousLocation.scoreId);
    if (!target) return;

    if (activeScore) {
      const current = {
        scoreId: activeScore.id,
        page: activeScore.currentPage,
      };

      setActiveScoreId(target.id);

      setScores((prev) =>
        prev.map((score) =>
          score.id === target.id
            ? {
                ...score,
                currentPage: clampPage(previousLocation.page, score.totalPages),
              }
            : score
        )
      );

      setPreviousLocation(current);
    }

    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function handlePageJump() {
    const target = Number(pageInput);
    if (!Number.isFinite(target)) return;
    goToPage(target);
  }

  function jumpToMovement(pageNumber: number) {
    goToPage(pageNumber);
  }

  function setMovementPage(label: MovementLabel) {
    updateActiveScore((score) => ({
      ...score,
      movements: score.movements.map((movement) =>
        movement.label === label
          ? { ...movement, pageNumber: score.currentPage }
          : movement
      ),
    }));
  }

  function moveScore(scoreId: string, direction: "up" | "down") {
    setScores((prev) => {
      const index = prev.findIndex((score) => score.id === scoreId);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      return next;
    });
  }

  function removeScore(scoreId: string) {
    const targetIndex = scores.findIndex((score) => score.id === scoreId);

    if (pdfDocsRef.current[scoreId]?.destroy) {
      pdfDocsRef.current[scoreId].destroy?.().catch(() => {
        // ignore
      });
    }

    delete pdfDocsRef.current[scoreId];

    const remaining = scores.filter((score) => score.id !== scoreId);
    setScores(remaining);

    if (activeScoreId === scoreId) {
      const nextActive =
        remaining[targetIndex] ?? remaining[targetIndex - 1] ?? remaining[0] ?? null;
      setActiveScoreId(nextActive?.id ?? null);
    }

    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function renameScore(scoreId: string, nextTitle: string) {
    setScores((prev) =>
      prev.map((score) =>
        score.id === scoreId ? { ...score, title: nextTitle } : score
      )
    );
  }

  function handleScorePageClick(event: MouseEvent<HTMLDivElement>) {
    if (mode === "performance") return;
    if (!activeScore) return;
    if (draggingSymbolId) return;
    if (!selectedSymbol) return;

    const { x, y } = getPointerPositionOnScorePage(event);

    const newSymbol: PlacedSymbol = {
      id: createId("symbol"),
      page: activeScore.currentPage,
      symbol: selectedSymbol,
      x,
      y,
      size: symbolSize,
      color: symbolColor,
    };

    updateActiveScore((score) => ({
      ...score,
      symbols: [...score.symbols, newSymbol],
    }));

    setSelectedPlacedSymbolId(null);
  }

  function handleSymbolPointerDown(
    event: PointerEvent<HTMLDivElement>,
    symbolId: string
  ) {
    if (mode === "performance") return;

    event.stopPropagation();

    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    dragMovedRef.current = false;
    setSelectedPlacedSymbolId(symbolId);
    setDraggingSymbolId(symbolId);

    const symbol = activeScore?.symbols.find((item) => item.id === symbolId);
    if (symbol) {
      setSymbolSize(symbol.size);
      setSymbolColor(symbol.color);
      setSelectedSymbol(symbol.symbol);
    }
  }

  function handleScorePagePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingSymbolId || !activeScore) return;

    dragMovedRef.current = true;

    const { x, y } = getPointerPositionOnScorePage(event);

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.map((item) =>
        item.id === draggingSymbolId ? { ...item, x, y } : item
      ),
    }));
  }

  function handleScorePagePointerUp() {
    if (draggingSymbolId && dragMovedRef.current) {
      setSelectedPlacedSymbolId(null);
    }

    dragMovedRef.current = false;
    setDraggingSymbolId(null);
  }

  function handlePerformancePointerDown(event: PointerEvent<HTMLDivElement>) {
    performancePointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now(),
    };
    didSwipeRef.current = false;
  }

  function handlePerformancePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = performancePointerStartRef.current;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    performancePointerStartRef.current = null;

    if (absX > 55 && absX > absY * 1.2) {
      didSwipeRef.current = true;

      if (dx < 0) {
        goToNextPage();
      } else {
        goToPreviousPage();
      }

      window.setTimeout(() => {
        didSwipeRef.current = false;
      }, 120);

      return;
    }

    if (didSwipeRef.current) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;

    if (x < rect.width * 0.22) {
      goToPreviousPage();
      return;
    }

    if (x > rect.width * 0.78) {
      goToNextPage();
      return;
    }

    setShowNavigator((prev) => !prev);
  }

  function updateSelectedSymbolSize(nextSize: number) {
    setSymbolSize(nextSize);

    if (!selectedPlacedSymbolId) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.map((item) =>
        item.id === selectedPlacedSymbolId ? { ...item, size: nextSize } : item
      ),
    }));
  }

  function updateSelectedSymbolColor(nextColor: string) {
    setSymbolColor(nextColor);

    if (!selectedPlacedSymbolId) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.map((item) =>
        item.id === selectedPlacedSymbolId ? { ...item, color: nextColor } : item
      ),
    }));
  }

  function replaceSelectedSymbol(nextSymbol: string) {
    setSelectedSymbol(nextSymbol);
  }

  function deleteSelectedSymbol() {
    if (!selectedPlacedSymbolId) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.filter((item) => item.id !== selectedPlacedSymbolId),
    }));

    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }

  function nudgeSelectedSymbol(dx: number, dy: number) {
    if (!selectedPlacedSymbolId) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.map((item) =>
        item.id === selectedPlacedSymbolId
          ? {
              ...item,
              x: Math.min(Math.max(item.x + dx, 0), 100),
              y: Math.min(Math.max(item.y + dy, 0), 100),
            }
          : item
      ),
    }));
  }

  function undoLastSymbol() {
    if (!activeScore) return;

    const samePageSymbols = activeScore.symbols.filter(
      (item) => item.page === activeScore.currentPage
    );
    const last = samePageSymbols[samePageSymbols.length - 1];

    if (!last) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.filter((item) => item.id !== last.id),
    }));

    if (last.id === selectedPlacedSymbolId) {
      setSelectedPlacedSymbolId(null);
    }
  }

  function clearCurrentPageSymbols() {
    if (!activeScore) return;

    updateActiveScore((score) => ({
      ...score,
      symbols: score.symbols.filter((item) => item.page !== score.currentPage),
    }));

    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
  }


  function exportScoreReaderBackup() {
    if (scores.length === 0) {
      setPdfError("保存する演奏会セットがありません。");
      return;
    }

    const missingPdf = scores.some((score) => !score.pdfDataUrl);
    if (missingPdf) {
      setPdfError(
        "PDF本体が残っていない曲があります。ブラウザ再読み込み後の場合は、PDFを再度追加してから保存してください。"
      );
      return;
    }

    const backup: ScoreReaderBackup = {
      app: "Orchestra Score Reader",
      version: 1,
      exportedAt: new Date().toISOString(),
      activeScoreId,
      symbolSize,
      symbolColor,
      scores,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    downloadBlob(blob, createDownloadFileName("concert-set", "score-reader.json"));
    setPdfError(null);
  }

  async function handleBackupImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsBackupWorking(true);
    setPdfError(null);

    try {
      const text = await file.text();
      const backup = JSON.parse(text) as ScoreReaderBackup;

      if (backup.app !== "Orchestra Score Reader" || !Array.isArray(backup.scores)) {
        throw new Error("Invalid Score Reader backup file.");
      }

      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

      Object.values(pdfDocsRef.current).forEach((doc) => {
        if (doc.destroy) {
          doc.destroy().catch(() => {
            // ignore
          });
        }
      });

      const restoredScores: ScoreItem[] = [];
      const restoredPdfDocs: Record<string, PdfDocumentLike> = {};

      for (const score of backup.scores) {
        if (!score.pdfDataUrl) {
          throw new Error("Backup does not include PDF data.");
        }

        const bytes = await dataUrlToUint8Array(score.pdfDataUrl);
        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdfDocument = await loadingTask.promise;

        restoredPdfDocs[score.id] = pdfDocument;
        restoredScores.push({
          ...score,
          totalPages: pdfDocument.numPages,
          currentPage: clampPage(score.currentPage, pdfDocument.numPages),
          movements: score.movements?.length ? score.movements : cloneDefaultMovements(),
          symbols: score.symbols ?? [],
        });
      }

      pdfDocsRef.current = restoredPdfDocs;
      setScores(restoredScores);
      setActiveScoreId(
        backup.activeScoreId && restoredScores.some((score) => score.id === backup.activeScoreId)
          ? backup.activeScoreId
          : restoredScores[0]?.id ?? null
      );
      setSymbolSize(backup.symbolSize || DEFAULT_SYMBOL_SIZE);
      setSymbolColor(backup.symbolColor || "#000000");
      setMode("edit");
      setShowNavigator(true);
      setSelectedPlacedSymbolId(null);
      setDraggingSymbolId(null);
      setRenderRevision((value) => value + 1);
    } catch (error) {
      console.error(error);
      setPdfError(
        "演奏会セットの読み込みに失敗しました。.score-reader.json ファイルを確認してください。"
      );
    } finally {
      setIsBackupWorking(false);
      event.target.value = "";
    }
  }

  async function exportAnnotatedPdf() {
    if (!activeScore) {
      setPdfError("記号付きPDFを書き出す楽譜を選択してください。");
      return;
    }

    if (!activeScore.pdfDataUrl) {
      setPdfError(
        "PDF本体が残っていません。ブラウザ再読み込み後の場合は、PDFを再度追加するか、.score-reader.json から復元してください。"
      );
      return;
    }

    setIsBackupWorking(true);
    setPdfError(null);

    try {
      const [{ PDFDocument, StandardFonts, rgb }] = await Promise.all([
        import("pdf-lib"),
      ]);

      const pdfBytes = await dataUrlToUint8Array(activeScore.pdfDataUrl);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      activeScore.symbols.forEach((symbol) => {
        const page = pages[symbol.page - 1];
        if (!page) return;

        const { width, height } = page.getSize();
        const x = (symbol.x / 100) * width;
        const y = height - (symbol.y / 100) * height;
        const color = toRgb01(symbol.color ?? "#000000");
        const text = makePdfSafeText(symbol.symbol);
        const size = Math.max(6, Math.min(symbol.size ?? DEFAULT_SYMBOL_SIZE, 96));

        page.drawText(text, {
          x,
          y,
          size,
          font,
          color: rgb(color.r, color.g, color.b),
        });
      });

      const annotatedBytes = await pdfDoc.save();
      const blob = new Blob([annotatedBytes], { type: "application/pdf" });
      downloadBlob(blob, createDownloadFileName(`${activeScore.title}-annotated`, "pdf"));
    } catch (error) {
      console.error(error);
      setPdfError(
        "記号付きPDFの書き出しに失敗しました。pdf-lib が未インストールの場合は npm install pdf-lib を実行してください。"
      );
    } finally {
      setIsBackupWorking(false);
    }
  }

  function resetReader() {
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {
        // ignore
      }
    }

    Object.values(pdfDocsRef.current).forEach((doc) => {
      if (doc.destroy) {
        doc.destroy().catch(() => {
          // ignore
        });
      }
    });

    pdfDocsRef.current = {};

    setMode("edit");
    setScores([]);
    setActiveScoreId(null);
    setPreviousLocation(null);
    setPageInput("1");
    setSelectedSymbol("1");
    setSymbolSize(DEFAULT_SYMBOL_SIZE);
    setSymbolColor("#000000");
    setShowNavigator(true);
    setSelectedPlacedSymbolId(null);
    setDraggingSymbolId(null);
    setIsPdfLoading(false);
    setIsPageRendering(false);
    setPdfError(null);
    setIsBackupWorking(false);
    setRenderRevision((value) => value + 1);

    localStorage.removeItem(STORAGE_KEYS.scoresMeta);
    localStorage.removeItem(STORAGE_KEYS.activeScoreId);
    localStorage.removeItem(STORAGE_KEYS.symbolSize);
    localStorage.removeItem(STORAGE_KEYS.symbolColor);
  }

  function renderScoreSurface(isPerformance: boolean) {
    if (!activeScore) {
      return (
        <div className="flex h-full min-h-[64vh] w-full items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-center">
          <div>
            <p className="text-lg font-black text-white">
              演奏会セットリストにPDFを追加してください
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              左サイドバーの「複数PDFを追加」から、本番で使う楽譜PDFを曲順に登録できます。
            </p>
          </div>
        </div>
      );
    }

    if (!pdfDocsRef.current[activeScore.id]) {
      return (
        <div className="flex h-full min-h-[64vh] w-full items-center justify-center rounded-2xl border border-dashed border-amber-500/60 bg-slate-900 p-6 text-center">
          <div>
            <p className="text-lg font-black text-amber-300">
              PDF本体の再アップロードが必要です
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              ブラウザを再読み込みした場合、曲順・記号情報は残りますが、PDF本体は再度追加してください。
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={scorePageRef}
        onClick={handleScorePageClick}
        onPointerMove={handleScorePagePointerMove}
        onPointerUp={handleScorePagePointerUp}
        onPointerCancel={handleScorePagePointerUp}
        className={
          isPerformance
            ? "relative inline-block w-full max-w-full select-none"
            : "relative inline-block max-h-full max-w-full cursor-crosshair select-none"
        }
      >
        <canvas
          ref={canvasRef}
          className={
            isPerformance
              ? "block h-auto w-full bg-white"
              : "block max-h-full max-w-full rounded-xl bg-white shadow-2xl"
          }
        />

        {currentPageSymbols.map((item) => {
          const isSelected = selectedPlacedSymbolId === item.id;

          return (
            <div
              key={item.id}
              onPointerDown={(event) => handleSymbolPointerDown(event, item.id)}
              onClick={(event) => {
                event.stopPropagation();
                if (mode !== "performance") {
                  setSelectedPlacedSymbolId(item.id);
                }
              }}
              className={
                isSelected
                  ? "absolute cursor-move select-none rounded-sm outline outline-2 outline-blue-500"
                  : "absolute cursor-move select-none"
              }
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: isSelected ? 30 : 20,
                padding: isSelected ? "2px 4px" : "0",
                pointerEvents: isPerformance ? "none" : "auto",
              }}
            >
              <span
                className="font-serif font-bold"
                style={{
                  fontSize: `${item.size ?? DEFAULT_SYMBOL_SIZE}px`,
                  color: item.color ?? "#000000",
                  lineHeight: "1",
                  textShadow:
                    item.color === "#000000"
                      ? "0 0 1px rgba(255,255,255,0.3)"
                      : "none",
                }}
              >
                {item.symbol}
              </span>
            </div>
          );
        })}

        {isPageRendering && (
          <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-4 py-2 text-xs font-bold text-emerald-300">
            p.{currentPage} を描画中...
          </div>
        )}
      </div>
    );
  }

  if (mode === "performance") {
    return (
      <main
        className="fixed inset-0 overflow-hidden bg-black text-white"
        style={{
          zIndex: 2147483647,
        }}
      >
        <div
          ref={scoreViewportRef}
          onPointerDown={handlePerformancePointerDown}
          onPointerUp={handlePerformancePointerUp}
          className="relative flex h-[100dvh] w-screen touch-pan-y select-none items-start justify-center overflow-y-auto overflow-x-hidden bg-black"
        >
          {renderScoreSurface(true)}

          <button
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              exitPerformanceMode();
            }}
            className="fixed right-3 top-12 z-[9999999] rounded-full bg-emerald-400/90 px-4 py-2 text-xs font-black text-slate-950 shadow-2xl backdrop-blur"
          >
            編集へ戻る
          </button>

          {showNavigator && (
            <>
              <div
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                className="fixed left-0 right-0 top-0 z-50 bg-black/75 px-3 py-2 backdrop-blur"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pr-32">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-white">
                      {activeScore
                        ? `${activeScoreIndex + 1}/${scores.length}  ${activeScore.title}`
                        : "PDF未選択"}
                    </p>
                    <p className="text-xs text-slate-300">
                      p.{currentPage} / {totalPages}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  goToPreviousPage();
                }}
                className="fixed left-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/45 px-4 py-5 text-2xl font-black text-white backdrop-blur"
              >
                ‹
              </button>

              <button
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  goToNextPage();
                }}
                className="fixed right-3 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/45 px-4 py-5 text-2xl font-black text-white backdrop-blur"
              >
                ›
              </button>

              <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/75 px-3 py-2 backdrop-blur">
                <div
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerUp={(event) => event.stopPropagation()}
                  className="flex items-center justify-center gap-2 overflow-x-auto"
                >
                  <button
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToPreviousScore();
                    }}
                    disabled={activeScoreIndex <= 0}
                    className="shrink-0 rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    前の曲
                  </button>

                  <button
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToPreviousPage();
                    }}
                    disabled={!activeScore}
                    className="shrink-0 rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    前ページ
                  </button>

                  {currentMovements.map((movement) => (
                    <button
                      key={movement.id}
                      onPointerDown={(event) => event.stopPropagation()}
                      onPointerUp={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation();
                        jumpToMovement(movement.pageNumber);
                      }}
                      className={
                        currentMovement?.label === movement.label
                          ? "shrink-0 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950"
                          : "shrink-0 rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold"
                      }
                    >
                      {movement.label}
                    </button>
                  ))}

                  <button
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToNextPage();
                    }}
                    disabled={!activeScore}
                    className="shrink-0 rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    次ページ
                  </button>

                  <button
                    onPointerDown={(event) => event.stopPropagation()}
                    onPointerUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      goToNextScore();
                    }}
                    disabled={
                      activeScoreIndex < 0 || activeScoreIndex >= scores.length - 1
                    }
                    className="shrink-0 rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold disabled:opacity-40"
                  >
                    次の曲
                  </button>
                </div>
              </div>
            </>
          )}

          {!showNavigator && (
            <div className="pointer-events-none fixed bottom-3 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] text-slate-300">
              中央タップでメニュー表示 ／ 左スワイプで次ページ
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main
      className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-slate-950 text-slate-100"
      style={{
        zIndex: 2147483647,
      }}
    >
      <button
        onClick={enterPerformanceMode}
        disabled={!activeScore}
        className="fixed bottom-4 right-4 z-[9999999] rounded-full bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 shadow-2xl disabled:opacity-40"
      >
        本番モード
      </button>

      <div className="mx-auto flex min-h-[100dvh] max-w-[1720px] flex-col px-3 py-3 md:px-5 md:py-4">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/85 px-4 py-3 shadow-2xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              HitoriBIZ Orchestra Tools
            </p>
            <h1 className="mt-1 text-xl font-black tracking-tight md:text-2xl">
              Orchestra Score Reader App
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm">
              {activeScore ? (
                <>
                  <span className="text-slate-400">
                    {activeScoreIndex + 1}/{scores.length}：
                  </span>
                  <span className="font-bold text-white">{activeScore.title}</span>
                  <span className="ml-2 text-slate-400">p.</span>
                  <span className="font-bold text-white">
                    {currentPage} / {totalPages}
                  </span>
                  <span className="ml-2 text-emerald-300">
                    {currentMovement?.label} {currentMovement?.title}
                  </span>
                </>
              ) : (
                <span className="text-slate-300">PDF未選択</span>
              )}
            </div>

            <button
              onClick={enterPerformanceMode}
              disabled={!activeScore}
              className="rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-40"
            >
              本番モード
            </button>

            <button
              onClick={resetReader}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              リセット
            </button>
          </div>
        </header>

        <section className="grid min-h-[calc(100dvh-120px)] flex-1 grid-cols-1 gap-3 overflow-visible lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_270px]">
          <aside className="order-2 max-h-none overflow-visible rounded-2xl border border-slate-800 bg-slate-900 p-3 lg:order-1 lg:max-h-none lg:overflow-auto">
            <div className="mb-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-2">
              <h2 className="text-xs font-black text-emerald-300">
                演奏会セットリスト
              </h2>

              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-950 px-3 py-3 text-center hover:border-emerald-400">
                <span className="text-xs font-bold text-white">複数PDFを追加</span>
                <span className="mt-1 text-[10px] leading-relaxed text-slate-400">
                  Ctrl / Shiftで複数選択可
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  multiple
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>

              <input
                ref={backupInputRef}
                type="file"
                accept=".score-reader.json,application/json"
                onChange={handleBackupImport}
                className="hidden"
              />

              <div className="mt-2 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={exportScoreReaderBackup}
                  disabled={scores.length === 0 || isBackupWorking}
                  className="rounded-xl bg-blue-500 px-3 py-2 text-xs font-black text-white shadow hover:bg-blue-400 disabled:opacity-40"
                >
                  演奏会セットを保存
                </button>

                <button
                  type="button"
                  onClick={() => backupInputRef.current?.click()}
                  disabled={isBackupWorking}
                  className="rounded-xl border border-blue-400/60 bg-blue-400/10 px-3 py-2 text-xs font-black text-blue-100 hover:bg-blue-400/20 disabled:opacity-40"
                >
                  演奏会セットを復元
                </button>

                <button
                  type="button"
                  onClick={exportAnnotatedPdf}
                  disabled={!activeScore || isBackupWorking}
                  className="rounded-xl border border-amber-400/70 bg-amber-400 px-3 py-2 text-xs font-black text-slate-950 shadow hover:bg-amber-300 disabled:opacity-40"
                >
                  記号付きPDFを書き出し
                </button>
              </div>

              {isBackupWorking && (
                <div className="mt-2 rounded-lg bg-slate-950 p-2 text-[10px] font-bold text-blue-200">
                  保存・復元・書き出しを処理中です...
                </div>
              )}

              {isPdfLoading && (
                <div className="mt-2 rounded-lg bg-slate-950 p-2 text-[10px] font-bold text-emerald-300">
                  PDFを読み込み中です...
                </div>
              )}

              {pdfError && (
                <div className="mt-2 rounded-lg border border-red-400/40 bg-red-500/10 p-2 text-[10px] leading-relaxed text-red-200">
                  {pdfError}
                </div>
              )}

              <div className="mt-3 space-y-1.5">
                {scores.length === 0 && (
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-[10px] leading-relaxed text-slate-400">
                    ここに演奏会で使う曲PDFを追加します。
                  </div>
                )}

                {scores.map((score, index) => {
                  const active = score.id === activeScoreId;

                  return (
                    <div
                      key={score.id}
                      className={
                        active
                          ? "rounded-lg border border-emerald-400 bg-emerald-400/10 p-2"
                          : "rounded-lg border border-slate-800 bg-slate-950 p-2"
                      }
                    >
                      <button
                        onClick={() => {
                          setActiveScoreId(score.id);
                          setSelectedPlacedSymbolId(null);
                          setDraggingSymbolId(null);
                        }}
                        className="w-full text-left"
                      >
                        <p className="text-[11px] font-black text-white">
                          {index + 1}. {score.title}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {score.totalPages}ページ / 現在 p.{score.currentPage}
                        </p>
                      </button>

                      <input
                        value={score.title}
                        onChange={(event) =>
                          renameScore(score.id, event.target.value)
                        }
                        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-white outline-none focus:border-emerald-400"
                      />

                      <div className="mt-2 grid grid-cols-4 gap-1">
                        <button
                          onClick={() => moveScore(score.id, "up")}
                          className="rounded-md border border-slate-700 px-1.5 py-1 text-[10px] font-bold hover:bg-slate-800"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveScore(score.id, "down")}
                          className="rounded-md border border-slate-700 px-1.5 py-1 text-[10px] font-bold hover:bg-slate-800"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => setActiveScoreId(score.id)}
                          className="rounded-md border border-slate-700 px-1.5 py-1 text-[10px] font-bold hover:bg-slate-800"
                        >
                          表示
                        </button>
                        <button
                          onClick={() => removeScore(score.id)}
                          className="rounded-md border border-red-400/40 px-1.5 py-1 text-[10px] font-bold text-red-200 hover:bg-red-500/20"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-3">
              <h2 className="text-xs font-black text-white">記号パレット</h2>
              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                記号を選んで楽譜をタップ。配置済み記号は直接タップで編集できます。
              </p>
            </div>

            <div className="space-y-3">
              {PALETTE_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="mb-1 text-[11px] font-black text-emerald-300">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-5 gap-1.5">
                    {group.items.map((item) => {
                      const active = selectedSymbol === item;

                      return (
                        <button
                          key={item}
                          onClick={() => replaceSelectedSymbol(item)}
                          className={
                            active
                              ? "rounded-md bg-emerald-400 px-1.5 py-1.5 text-center text-[11px] font-black text-slate-950 shadow"
                              : "rounded-md border border-slate-700 bg-slate-950 px-1.5 py-1.5 text-center text-[11px] font-bold text-white hover:bg-slate-800"
                          }
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-2">
              <h3 className="text-[11px] font-bold text-slate-300">
                選択中の記号
              </h3>

              <div
                className="mt-2 flex h-10 items-center justify-center rounded-lg bg-white font-serif font-black"
                style={{ color: symbolColor, fontSize: `${symbolSize}px` }}
              >
                {selectedSymbol ?? "未選択"}
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900 p-2">
                <h3 className="text-[11px] font-bold text-slate-300">
                  記号スタイル
                </h3>

                <label className="mt-2 block text-[10px] font-bold text-slate-400">
                  サイズ：{symbolSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={symbolSize}
                  onChange={(event) =>
                    updateSelectedSymbolSize(Number(event.target.value))
                  }
                  className="mt-1 w-full"
                />

                <label className="mt-2 block text-[10px] font-bold text-slate-400">
                  色
                </label>
                <div className="mt-2 grid grid-cols-6 gap-1.5">
                  {SYMBOL_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updateSelectedSymbolColor(color.value)}
                      className={
                        symbolColor === color.value
                          ? "rounded-md border-2 border-white px-1.5 py-1.5 text-[10px] font-bold shadow"
                          : "rounded-md border border-slate-700 px-1.5 py-1.5 text-[10px] font-bold"
                      }
                      style={{ backgroundColor: color.value, color: "#ffffff" }}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPlacedSymbol && (
                <div className="mt-3 rounded-xl border border-blue-400/30 bg-blue-500/10 p-2">
                  <h3 className="text-[11px] font-black text-blue-200">
                    配置済み記号を編集中
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-300">
                    {selectedPlacedSymbol.symbol} / p.
                    {selectedPlacedSymbol.page}
                  </p>

                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => nudgeSelectedSymbol(0, -1)}
                      className="col-start-2 rounded-md border border-slate-700 px-2 py-1.5 text-[11px] font-bold hover:bg-slate-800"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => nudgeSelectedSymbol(-1, 0)}
                      className="rounded-md border border-slate-700 px-2 py-1.5 text-[11px] font-bold hover:bg-slate-800"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => nudgeSelectedSymbol(0, 1)}
                      className="rounded-md border border-slate-700 px-2 py-1.5 text-[11px] font-bold hover:bg-slate-800"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => nudgeSelectedSymbol(1, 0)}
                      className="rounded-md border border-slate-700 px-2 py-1.5 text-[11px] font-bold hover:bg-slate-800"
                    >
                      →
                    </button>
                  </div>

                  <button
                    onClick={deleteSelectedSymbol}
                    className="mt-2 w-full rounded-md border border-red-400/40 px-2 py-1.5 text-[11px] font-bold text-red-200 hover:bg-red-500/20"
                  >
                    選択記号を削除
                  </button>
                </div>
              )}

              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <button
                  onClick={undoLastSymbol}
                  className="rounded-md border border-slate-700 px-2 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-slate-800"
                >
                  1つ戻す
                </button>

                <button
                  onClick={clearCurrentPageSymbols}
                  className="rounded-md border border-red-400/40 px-2 py-1.5 text-[11px] font-bold text-red-200 hover:bg-red-500/20"
                >
                  このページ消去
                </button>
              </div>
            </div>
          </aside>

          <div className="order-1 flex min-h-[70vh] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={goToPreviousScore}
                  disabled={activeScoreIndex <= 0}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  前の曲
                </button>

                <button
                  onClick={goToPreviousPage}
                  disabled={!activeScore}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  ← 前
                </button>

                <button
                  onClick={goToNextPage}
                  disabled={!activeScore}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  次 →
                </button>

                <button
                  onClick={goToNextScore}
                  disabled={activeScoreIndex < 0 || activeScoreIndex >= scores.length - 1}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-bold hover:bg-slate-800 disabled:opacity-40"
                >
                  次の曲
                </button>

                <button
                  onClick={backToPreviousLocation}
                  disabled={!previousLocation}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  戻る
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={pageInput}
                  onChange={(event) => setPageInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handlePageJump();
                  }}
                  disabled={!activeScore}
                  className="w-20 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-center text-sm font-bold text-white outline-none focus:border-emerald-400 disabled:opacity-40"
                />

                <button
                  onClick={handlePageJump}
                  disabled={!activeScore}
                  className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600 disabled:opacity-40"
                >
                  ページ移動
                </button>

                <button
                  onClick={() => setShowNavigator((prev) => !prev)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-slate-800"
                >
                  {showNavigator ? "ナビ非表示" : "ナビ表示"}
                </button>
              </div>
            </div>

            <div
              ref={scoreViewportRef}
              className="relative flex min-h-[58vh] flex-1 items-start justify-center overflow-hidden bg-slate-800 p-3 md:p-6"
            >
              <div className="relative flex h-full w-full items-start justify-center overflow-hidden rounded-2xl bg-slate-950 p-3 shadow-2xl">
                {renderScoreSurface(false)}
              </div>
            </div>

            {showNavigator && activeScore && (
              <div className="border-t border-slate-800 bg-slate-950/95 px-3 py-3">
                <div className="mb-3 rounded-xl border border-slate-800 bg-slate-900 p-2">
                  <p className="mb-2 text-center text-[11px] font-bold text-slate-400">
                    楽章しおりへ移動
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentMovements.map((movement) => (
                      <button
                        key={movement.id}
                        onClick={() => jumpToMovement(movement.pageNumber)}
                        className={
                          currentMovement?.label === movement.label
                            ? "rounded-xl bg-emerald-400 px-4 py-2 text-sm font-black text-slate-950"
                            : "rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
                        }
                      >
                        {movement.label}
                        <span className="ml-2 text-xs opacity-70">
                          p.{movement.pageNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-2">
                  <p className="mb-2 text-center text-[11px] font-black text-amber-300">
                    現在ページ p.{currentPage} を楽章開始ページとして登録
                  </p>

                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {currentMovements.map((movement) => (
                      <button
                        key={`set-${movement.id}`}
                        onClick={() => setMovementPage(movement.label)}
                        className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-black text-slate-950 shadow hover:bg-amber-300"
                      >
                        {movement.label} に登録
                        <span className="mt-1 block text-[10px] font-bold opacity-70">
                          現在 p.{movement.pageNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => goToPage(1)}
                    className="shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold hover:bg-slate-800"
                  >
                    p.1
                  </button>

                  {currentPage > 10 && (
                    <div className="flex shrink-0 items-center px-1 text-slate-500">…</div>
                  )}

                  {visibleThumbPages.map((pageNumber) => {
                    const active = pageNumber === currentPage;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={
                          active
                            ? "shrink-0 rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950"
                            : "shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-800"
                        }
                      >
                        p.{pageNumber}
                      </button>
                    );
                  })}

                  {currentPage < totalPages - 9 && (
                    <div className="flex shrink-0 items-center px-1 text-slate-500">…</div>
                  )}

                  <button
                    onClick={() => goToPage(totalPages)}
                    className="shrink-0 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold hover:bg-slate-800"
                  >
                    p.{totalPages}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="order-3 hidden overflow-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 xl:block">
            <h2 className="text-sm font-black text-white">楽章しおり設定</h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              現在ページを各楽章の開始ページとして登録できます。
            </p>

            {activeScore ? (
              <div className="mt-4 space-y-3">
                {currentMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-black text-emerald-300">
                          {movement.label}
                        </p>
                        <p className="text-xs text-slate-400">
                          {movement.title}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-500">登録ページ</p>
                        <p className="text-lg font-black text-white">
                          p.{movement.pageNumber}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setMovementPage(movement.label)}
                      className="mt-3 w-full rounded-xl bg-amber-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-amber-300"
                    >
                      現在ページ p.{currentPage} を {movement.label} に登録
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-400">
                PDFを追加すると、曲ごとの楽章しおりを設定できます。
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}