import jsPDF from "jspdf";
import html2canvas from "html2canvas";

class DiplomaGenerator {
	#documentEl;
	#fantomDocument;
	#loader;
	#form;

	constructor(documentEl, fantomDocument, form, loader) {
		this.#documentEl = documentEl;
		this.#fantomDocument = fantomDocument;
		this.#form = form;
		this.#loader = loader;
	}

	initDiplomaGenerator = () => {
		const fioEl = document.querySelectorAll(".diploma__fio");
		const majorEl = document.querySelectorAll(".diploma__major");
		const organizatorEl = document.querySelectorAll(
			".diploma__organization-fio"
		);
		const dateEl = document.querySelectorAll(".diploma__data");

		const formData = this.#form.querySelectorAll("input");

		const diplomaData = [fioEl, majorEl, organizatorEl, dateEl];

		for (let i = 0; i < formData.length; i++) {
			formData[i].addEventListener("input", () => {
				for (let j = 0; j < diplomaData[i].length; j++) {
					diplomaData[i][j].textContent = formData[i].value;

					if (formData[i].id === "date-input") {
						if (formData[i].value === "") {
							diplomaData[i][j].textContent = "Дата";
						} else {
							// Если это поле даты
							diplomaData[i][j].textContent = this.#getLocalDate(formData[i]);
						}
					}
				}
			});
		}
	};

	#getLocalDate = (input) => {
		return new Date(input.value).toLocaleDateString("ru-RU", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	downloadDocumentByPDF = (btn) => {
		btn.addEventListener("click", () => {
			if (this.#isEmptyRequiredInputs()) {
				alert("Заполните ФИО");
				return;
			}

			if (this.#loader) this.#showLoader();

			html2canvas(this.#fantomDocument, { scale: 6, useCORS: true }).then(
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
			if (this.#isEmptyRequiredInputs()) {
				this.#setErrorInputs();
				alert("Заполните обязательные поля!");
				return;
			}

			this.#removeErrorInputs();

			if (this.#loader) this.#showLoader();

			html2canvas(this.#fantomDocument, { scale: 6 }).then((canvas) => {
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

	#setErrorInputs = () => {
		const inputs = this.#form.querySelectorAll("input[required]");
		inputs.forEach((input) => {
			input.style.color = "red";
		});
	};

	#removeErrorInputs = () => {
		const inputs = this.#form.querySelectorAll("input[required]");
		inputs.forEach((input) => {
			input.style.color = "black";
		});
	};

	#isEmptyRequiredInputs = () => {
		const inputs = this.#form.querySelectorAll("input[required]");
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].value === "") return true;
		}

		return false;
	};

	#showLoader = () => {
		this.#loader.classList.add("loading--active");
	};

	#hideLoader = () => {
		this.#loader.classList.remove("loading--active");
	};
}

export default DiplomaGenerator;
