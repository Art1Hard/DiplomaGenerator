import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Toastify from "toastify-js";

import "toastify-js/src/toastify.css";
import Form from "./Form.js";

class DiplomaGenerator {
	#documentElement;
	#form;
	#loader;
	#bodyClassLocked;

	constructor(
		documentSelector,
		form,
		{ loader, bodyClassLocked = "locked", inputErrorClass }
	) {
		this.#documentElement = document.querySelector(documentSelector);
		this.#form = new Form(form, { errorClass: inputErrorClass });
		this.#loader = loader;
		this.#bodyClassLocked = bodyClassLocked;
	}

	initDiplomaGenerator = () => {
		const inputs = this.#form.getInputs();

		const diplomaData = this.#getDiplomaFillingElements();

		inputs.forEach((input, index) => {
			this.#resetInputValue(input);

			input.addEventListener("input", () => {
				diplomaData[index].forEach((diplomaText) => {
					diplomaText.textContent = input.value;

					if (input.id !== "date-input") return;

					if (this.#form.isEmptyInput(input)) {
						diplomaText.textContent = "Дата";
						return;
					}

					diplomaText.textContent = this.#form.getLocalDate(input);
				});
			});
		});
	};

	#getDiplomaFillingElements = () => {
		const fioEl = document.querySelectorAll(".diploma__fio");
		const majorEl = document.querySelectorAll(".diploma__major");
		const organizatorEl = document.querySelectorAll(
			".diploma__organization-fio"
		);
		const dateEl = document.querySelectorAll(".diploma__data");

		return [fioEl, majorEl, organizatorEl, dateEl];
	};

	#resetInputValue = (input) => {
		input.value = "";
	};

	downloadDocument = (btnSelector, isPDF = false) => {
		const btn = document.querySelector(btnSelector);

		if (!btn) {
			console.error(`downloadButton with ${btnSelector} selector is undefined`);
			return;
		}

		btn.addEventListener("click", () => {
			if (!this.#form.validateInputs()) {
				this.#showErrorToast();
				return;
			}

			if (this.#loader) {
				this.#showLoader();
			}

			html2canvas(this.#documentElement, { scale: 6, useCORS: true }).then(
				(canvas) => {
					if (isPDF) {
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

						return;
					}

					const link = document.createElement("a");
					link.href = canvas.toDataURL("image/png");
					link.download = "diploma.png";

					// Автоматически кликаем на ссылку для скачивания изображения
					link.click();

					if (this.#loader) {
						this.#hideLoader();
					}
				}
			);
		});
	};

	#lockBody = () => {
		document.body.classList.add(this.#bodyClassLocked);
	};

	#unlockBody = () => {
		document.body.classList.remove(this.#bodyClassLocked);
	};

	#showLoader = () => {
		this.#lockBody();
		this.#loader.classList.add("loading--active");
	};

	#hideLoader = () => {
		this.#unlockBody();
		this.#loader.classList.remove("loading--active");
	};

	#showErrorToast = () => {
		if (document.querySelector(".toastify")) return;
		Toastify({
			text: "Заполните обязательные&nbsp;поля!",
			duration: 3000,
			gravity: "top", // `top` or `bottom`
			position: "center", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				cursor: "default",
				background: "#a83232",
				padding: "15px 40px",
				textAlign: "center",
			},
			escapeMarkup: false,
			offset: {
				y: 10,
			},
		}).showToast();
	};
}

export default DiplomaGenerator;
