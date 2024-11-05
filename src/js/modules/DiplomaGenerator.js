import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Toastify from "toastify-js";

import "toastify-js/src/toastify.css";

class DiplomaGenerator {
	#fantomDocument;
	#form;
	#loader;
	#bodyClassLocked;

	constructor(fantomDocument, form, { loader, bodyClassLocked = "locked" }) {
		this.#fantomDocument = fantomDocument;
		this.#form = form;
		this.#loader = loader;
		this.#bodyClassLocked = bodyClassLocked;
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
			this.#resetInputValue(formData[i]);

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

	#resetInputValue = (input) => {
		input.value = "";
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
			if (!this.#validateInputs()) {
				this.#showErrorToast();
				return;
			}

			if (this.#loader) {
				this.#showLoader();
			}

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

					if (this.#loader) {
						this.#hideLoader();
					}
				}
			);
		});
	};

	downloadDocumentByPNG = (btn) => {
		btn.addEventListener("click", () => {
			if (!this.#validateInputs()) {
				this.#showErrorToast();
				return;
			}

			if (this.#loader) {
				this.#showLoader();
			}

			html2canvas(this.#fantomDocument, { scale: 6 }).then((canvas) => {
				// Создаем ссылку для скачивания
				const link = document.createElement("a");
				link.href = canvas.toDataURL("image/png");
				link.download = "diploma.png";

				// Автоматически кликаем на ссылку для скачивания изображения
				link.click();

				if (this.#loader) {
					this.#hideLoader();
				}
			});
		});
	};

	#validateInputs = () => {
		const inputs = this.#form.querySelectorAll("input[required]");
		let isValidate = true;

		inputs.forEach((input) => {
			this.#removeErrorInput(input);

			if (this.#isEmptyRequierdInput(input)) {
				this.#addErrorInput(input);
				isValidate = false;
			}
		});

		return isValidate;
	};

	#addErrorInput = (input) => {
		if (input.value === "") input.classList.add("diploma-form__input--error");
	};

	#removeErrorInput = (input) => {
		if (input.value !== "")
			input.classList.remove("diploma-form__input--error");
	};

	#isEmptyRequierdInput = (input) => {
		if (input.value === "") return true;
		return false;
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
			text: "Заполните обязательные поля!",
			duration: 3000,
			gravity: "top", // `top` or `bottom`
			position: "center", // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				cursor: "default",
				background: "#a83232",
				padding: "15px 40px",
			},
			offset: {
				y: 10,
			},
		}).showToast();
	};
}

export default DiplomaGenerator;
