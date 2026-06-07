declare module "pdf-lib" {
  export const StandardFonts: {
    Helvetica: string;
    HelveticaBold: string;
    TimesRoman: string;
    Courier: string;
  };

  export function rgb(r: number, g: number, b: number): {
    r: number;
    g: number;
    b: number;
  };

  export class PDFDocument {
    static load(pdf: Uint8Array | ArrayBuffer): Promise<PDFDocument>;

    embedFont(font: string): Promise<unknown>;

    getPages(): Array<PDFPage>;

    getPage(index: number): PDFPage;

    setTitle(title: string): void;
    setSubject(subject: string): void;
    setKeywords(keywords: string[]): void;
    setProducer(producer: string): void;
    setCreator(creator: string): void;

    save(): Promise<Uint8Array>;
  }

  export type PDFPage = {
    getWidth(): number;
    getHeight(): number;
    getSize(): {
      width: number;
      height: number;
    };
    drawText(text: string, options?: Record<string, unknown>): void;
    drawLine(options?: Record<string, unknown>): void;
    drawRectangle(options?: Record<string, unknown>): void;
  };
}