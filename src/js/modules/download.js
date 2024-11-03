import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadDocumentByPdf = (documentEl, btn) => {
	btn.addEventListener("click", () => {
		html2canvas(documentEl, { scale: 6, useCORS: true }).then((canvas) => {
			const imgData = canvas.toDataURL("image/png");

			// Создаем PDF
			const pdf = new jsPDF("p", "pt", "a4");

			// Вычисляем размер изображения для подгонки под страницу PDF
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

			// Добавляем изображение на страницу PDF
			pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

			// Сохраняем PDF
			pdf.save("element.pdf");
		});
	});
};

export const downloadDocumentByPng = (documentEl, btn) => {
	btn.addEventListener("click", () => {
		html2canvas(documentEl, { scale: 6 }).then((canvas) => {
			// Создаем ссылку для скачивания
			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = "diploma.png";

			// Автоматически кликаем на ссылку для скачивания изображения
			link.click();
		});
	});
};
