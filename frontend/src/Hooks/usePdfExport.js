import jsPDF from "jspdf";

export default function usePdfExport() {
  const downloadPdf = async ({ elementRef, fileName = "report.pdf" }) => {
    if (!elementRef?.current) return;

    const pdf = new jsPDF("p", "mm", "a4");

    await pdf.html(elementRef.current, {
      margin: 10,
      autoPaging: "text",
      x: 0,
      y: 0,
      html2canvas: {
        scale: 0.8,          // keeps content fitting pages
        useCORS: true,
      },
      callback: () => {
        pdf.save(fileName);
      },
    });
  };

  return { downloadPdf };
}
