import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Toastify from "toastify-js";

import "toastify-js/src/toastify.css";
import Form from "./Form.js";

import Swiper from "swiper";
import { Mousewheel } from "swiper/modules";
import "swiper/scss";

class DiplomaGenerator {
	#documentElement;
	#form;
	#loader;
	#bodyClassLocked;
	#slider;
	#sliderClass;

	constructor(
		documentSelector,
		form,
		{ loader, bodyClassLocked = "locked", inputErrorClass, sliderClass }
	) {
		this.#documentElement = document.querySelector(documentSelector);
		this.#form = new Form(form, { errorClass: inputErrorClass });
		this.#loader = loader;
		this.#bodyClassLocked = bodyClassLocked;
		this.#sliderClass = sliderClass;
		this.#slider = this.#getNewSlider(
			this.#sliderClass,
			innerWidth > 721 ? "vertical" : "horizontal",
			innerWidth > 721 ? 20 : 0,
			innerWidth > 721 ? { invert: false } : false
		);
	}

	initSlider = () => {
		this.#createOnClickSlide();
		this.#createOnChangeDiplomaBg();
		this.#adaptiveSlider();
	};

	#createOnClickSlide = () => {
		this.#slider.slides.forEach((slide, index) => {
			slide.addEventListener("click", () => {
				this.#slider.slideTo(index);
			});
		});
	};

	#adaptiveSlider = () => {
		window.addEventListener("resize", () => {
			if (window.innerWidth > 721) {
				if (this.#slider.params.direction === "horizontal") {
					let activeIndex = this.#slider.activeIndex;
					this.#slider.destroy();

					this.#slider = this.#getNewSlider(this.#sliderClass, "vertical", 20, {
						invert: false,
					});

					this.#createOnChangeDiplomaBg();
					this.#slider.slideTo(activeIndex);
				}

				return;
			}

			if (this.#slider.params.direction === "vertical") {
				let activeIndex = this.#slider.activeIndex;
				this.#slider.destroy();

				this.#slider = new Swiper(this.#sliderClass, {
					direction: "horizontal",
					slidesPerView: 3,
					centeredSlides: true,
					pagination: {
						el: ".swiper-pagination",
						clickable: true,
					},
				});

				this.#createOnChangeDiplomaBg();
				this.#slider.slideTo(activeIndex);
			}
		});
	};

	#createOnChangeDiplomaBg = () => {
		this.#slider.on("slideChange", () => {
			// Получаем активный слайд
			const activeSlide = this.#slider.slides[this.#slider.activeIndex];
			// Ищем изображение внутри активного слайда
			const img = activeSlide.querySelector("img");

			document.querySelectorAll(".diploma").forEach((diploma) => {
				diploma.style.backgroundImage = `url('${img.src}')`;
			});
		});
	};

	#getNewSlider = (sliderClass, direction, spaceBetween, mousewheel) => {
		return new Swiper(sliderClass, {
			modules: [Mousewheel],
			speed: 200,
			direction: direction,
			spaceBetween: spaceBetween,
			slidesPerView: 3,
			centeredSlides: true,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
			mousewheel: mousewheel,
		});
	};

	initDiplomaGenerator = () => {
		const inputs = this.#form.getInputs();

		this.#createSwitchRecipient(inputs);

		const diplomaData = this.#getDiplomaFillingElements();
		inputs.forEach((input, index) => {
			this.#resetInputValue(input);

			this.#sendNowDateToElement(input);

			input.addEventListener("input", () => {
				diplomaData[index].forEach((diplomaText) => {
					diplomaText.textContent = input.value;

					this.#setDate(diplomaText, input);
					this.#setType(diplomaText, input);
					this.#setPosition(diplomaText, input);
					this.#setSupervisor(diplomaText, input);
					this.#setWorkName(diplomaText, input);
				});
			});
		});
	};

	#setWorkName = (diploma, input) => {
		if (input.id !== "work-name-input") return;
		diploma.textContent = `Работа: ${input.value}`;
	};

	#setSupervisor = (diploma, input) => {
		if (input.id !== "supervisor-input") return;

		if (input.value === "") {
			diploma.textContent = "";
			return;
		}
		diploma.textContent = `Руководитель: ${input.value}`;
	};

	#setPosition = (diploma, input) => {
		if (input.id !== "position-select") return;
		if (input.value === "Участник") return;
		diploma.textContent = `Победитель (${input.value})`;
	};

	#setType = (diploma, input) => {
		if (input.id !== "type-select") return;
		diploma.textContent = `${input.value.slice(0, -2)}ого конкурса`;
	};

	#setDate = (diploma, input) => {
		if (input.id !== "date-input") return;

		diploma.textContent = this.#form.getLocalDate(input);

		if (!this.#form.isEmptyInput(input)) return;
		diploma.textContent = "Дата";
	};

	#sendNowDateToElement = (input) => {
		if (input.id === "date-input") {
			const dateEl = document.querySelectorAll(".diploma__data");

			input.value = this.#getNowDate();
			dateEl.forEach((diplomaData) => {
				diplomaData.textContent = this.#form.getLocalDate(input);
			});
		}
	};

	#getNowDate = () => {
		return new Date().toISOString().split("T")[0];
	};

	#createSwitchRecipient = (inputs) => {
		const toggle = document.querySelector("#toggle");
		toggle.checked = false;
		const diplomas = document.querySelectorAll(".diploma");

		toggle.addEventListener("change", () => {
			diplomas[0].classList.toggle("toggle-supervisor");
			diplomas[1].classList.toggle("toggle-supervisor");
			this.#form.getFormElement().classList.toggle("toggle-supervisor");

			if (toggle.checked) {
				inputs[0].placeholder = "ФИО руководителя *";
			} else {
				inputs[0].placeholder = "ФИО участника *";
			}
		});
	};

	#getDiplomaFillingElements = () => {
		return [
			document.querySelectorAll(".diploma__fio"),
			document.querySelectorAll(".diploma__city"),
			document.querySelectorAll(".diploma__organization"),
			document.querySelectorAll(".diploma__supervisor"),
			document.querySelectorAll(".diploma__supervisor-member"),
			document.querySelectorAll(".diploma__position"),
			document.querySelectorAll(".diploma__type"),
			document.querySelectorAll(".diploma__nomination"),
			document.querySelectorAll(".diploma__work-name"),
			document.querySelectorAll(".diploma__data"),
		];
	};

	#resetInputValue = (input) => {
		input.value = "";

		if (input.tagName !== "SELECT") return;
		if (input.options.length < 0) return;

		input.selectedIndex = 0;
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
