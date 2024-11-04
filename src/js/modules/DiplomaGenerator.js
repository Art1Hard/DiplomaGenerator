import jsPDF from "jspdf";
import html2canvas from "html2canvas";

class DiplomaGenerator {
	#documentEl;
	#loader;
	#form;

	constructor(documentEl, form, loader) {
		this.#documentEl = documentEl;
		this.#form = form;
		this.#loader = loader;
	}

	downloadDocumentByPDF = (btn) => {
		btn.addEventListener("click", () => {
			if (this.#loader) this.#showLoader();

			html2canvas(this.#documentEl, { scale: 6, useCORS: true }).then(
				(canvas) => {
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

					if (this.#loader) this.#hideLoader();
				}
			);
		});
	};

	downloadDocumentByPNG = (btn) => {
		btn.addEventListener("click", () => {
			if (this.#loader) this.#showLoader();

			html2canvas(this.#documentEl, { scale: 6 }).then((canvas) => {
				// Создаем ссылку для скачивания
				const link = document.createElement("a");
				link.href = canvas.toDataURL("image/png");
				link.download = "diploma.png";

				// Автоматически кликаем на ссылку для скачивания изображения
				link.click();

				if (this.#loader) this.#hideLoader();
			});
		});
	};

	#showLoader = () => {
		this.#loader.classList.add("loading--active");
	};

	#hideLoader = () => {
		this.#loader.classList.remove("loading--active");
	};
}

export default DiplomaGenerator;
