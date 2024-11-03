import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadDocumentByPdf = (documentEl, btn, loading) => {
	btn.addEventListener("click", () => {
		loading.classList.add("loading--active");

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
			pdf.save("diploma.pdf");

			loading.classList.remove("loading--active");
		});
	});
};

export const downloadDocumentByPng = (documentEl, btn, loading) => {
	btn.addEventListener("click", () => {
		loading.classList.add("loading--active");
		html2canvas(documentEl, { scale: 6 }).then((canvas) => {
			// Создаем ссылку для скачивания
			const link = document.createElement("a");
			link.href = canvas.toDataURL("image/png");
			link.download = "diploma.png";

			// Автоматически кликаем на ссылку для скачивания изображения
			link.click();

			loading.classList.remove("loading--active");
		});
	});
};
