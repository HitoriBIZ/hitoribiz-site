declare module "pdfjs-dist" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(options: {
    data: Uint8Array;
  }): {
    promise: Promise<{
      numPages: number;
      getPage(pageNumber: number): Promise<{
        getViewport(options: { scale: number }): {
          width: number;
          height: number;
        };
        render(options: {
          canvasContext: CanvasRenderingContext2D;
          viewport: {
            width: number;
            height: number;
          };
        }): {
          promise: Promise<void>;
        };
        getTextContent?(): Promise<{
          items: Array<{
            str?: string;
          }>;
        }>;
      }>;
      getMetadata?(): Promise<{
        info?: Record<string, unknown>;
        metadata?: {
          get(name: string): string | null;
        } | null;
      }>;
    }>;
  };
}
