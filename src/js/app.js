import {
	downloadDocumentByPdf,
	downloadDocumentByPng,
} from "./modules/download.js";
import { isWebp } from "./modules/webp.js";

const diplomaEl = document
	.querySelector("#diploma-el")
	.querySelector(".diploma__background");
const downloadPDFBtn = document.getElementById("download-pdf");
const downloadPNGBtn = document.getElementById("download-png");
const loading = document.querySelector(".loading");

isWebp();
downloadDocumentByPdf(diplomaEl, downloadPDFBtn, loading);
downloadDocumentByPng(diplomaEl, downloadPNGBtn, loading);
