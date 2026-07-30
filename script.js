console.log("SCRIPT VERSION 2 LOADED");


import emailjs from
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm";

const emailJsConfig = {
    publicKey: "ihPtuw1I5LTejZE88",
    serviceId: "service_vq9iuu5",
    templateId: "template_780q3wl"
};

emailjs.init({
    publicKey: emailJsConfig.publicKey
});



const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
reveals.forEach((el) => observer.observe(el));

const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = `${(scrollTop / height) * 100}%`;
});

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const zone = document.getElementById('choiceZone');
const message = document.getElementById('answerMessage');
let noAttempts = 0;
const prompts = [
  'Nice try 😄',
  'That button seems confused.',
  'Nope — adventure is this way →',
  'Still trying? Bold move.',
  'The “No” option is losing signal…',
  'Final warning: adventure mode is mandatory.'
];

function moveNoButton() {
  noAttempts++;
  if (noAttempts >= 6) {
    noBtn.remove();
    message.textContent = '“No” is invalid. Only adventure remains.';
    message.className = 'answer-message invalid';
    return;
  }
  const maxX = Math.max(0, zone.clientWidth - noBtn.offsetWidth);
  const maxY = Math.max(0, zone.clientHeight - noBtn.offsetHeight);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  message.textContent = prompts[noAttempts - 1];
}

noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); }, { passive: false });

yesBtn.addEventListener('click', () => {
  message.textContent = 'Adventure confirmed! 🌊🚆';
  message.className = 'answer-message success';
  yesBtn.textContent = 'It’s a plan ✓';
  yesBtn.style.background = '#0d5f8f';
  if (document.getElementById('noBtn')) noBtn.remove();
  confettiBurst();
});

function confettiBurst() {
  const colors = ['#ffffff', '#ffd95a', '#10243e', '#dff5ff'];
  for (let i = 0; i < 55; i++) {
    const bit = document.createElement('i');
    bit.style.cssText = `position:fixed;z-index:9999;left:${50 + (Math.random()*12-6)}%;top:55%;width:${5+Math.random()*7}px;height:${8+Math.random()*9}px;background:${colors[Math.floor(Math.random()*colors.length)]};pointer-events:none;transform:rotate(${Math.random()*180}deg);transition:all ${1+Math.random()}s cubic-bezier(.2,.8,.2,1);`;
    document.body.appendChild(bit);
    requestAnimationFrame(() => {
      bit.style.left = `${Math.random()*100}%`;
      bit.style.top = `${25 + Math.random()*70}%`;
      bit.style.opacity = '0';
      bit.style.transform = `rotate(${500 + Math.random()*500}deg)`;
    });
    setTimeout(() => bit.remove(), 2200);
  }
}





const scrollVideos = document.querySelectorAll(".scrap-video video");

const videoObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    },
    {
        threshold: 0.45
    }
);

scrollVideos.forEach((video) => {
    videoObserver.observe(video);
});







import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =================================
   FIREBASE CONFIGURATION
================================= */

/*
Replace these placeholder values with the configuration
given by your Firebase project.
*/

const firebaseConfig = {
  apiKey: "AIzaSyC5lI67SWMJghOWPN1SoUmzViP-r_VABFw",
  authDomain: "varkalatripdate.firebaseapp.com",
  projectId: "varkalatripdate",
  storageBucket: "varkalatripdate.firebasestorage.app",
  messagingSenderId: "281937844503",
  appId: "1:281937844503:web:de57aaefe23e6dac81ff52",
  measurementId: "G-TXS710KS04"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);


/* =================================
   DATE SELECTION
================================= */

const dateForm = document.getElementById("adventureDateForm");
const dateInput = document.getElementById("adventureDate");
const dateMessage = document.getElementById("dateMessage");
const confirmButton = document.getElementById("confirmDateBtn");

const countdownCard = document.getElementById("countdownCard");
const countdownDays = document.getElementById("countdownDays");
const countdownHours = document.getElementById("countdownHours");
const countdownMinutes = document.getElementById("countdownMinutes");
const countdownSeconds = document.getElementById("countdownSeconds");

let countdownInterval;


// Prevent choosing a past date.
const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
)
    .toISOString()
    .split("T")[0];

dateInput.min = localToday;


dateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedDate = dateInput.value;

    if (!selectedDate) {
        showDateMessage("Please choose a date first.", "error");
        return;
    }

    const readableDate = formatSelectedDate(selectedDate);

    confirmButton.disabled = true;
    confirmButton.querySelector("span:first-child").textContent =
        "Saving your date...";

    showDateMessage("Confirming the adventure date...", "");

    try {
    // 1. Save the selected date to Firestore
    await addDoc(collection(database, "adventureDates"), {
        selectedDate: selectedDate,
        readableDate: readableDate,
        submittedAt: serverTimestamp(),
        source: "Varkala Adventure Website"
    });

    // 2. Prepare the email time
    const submittedTime = new Date().toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
    });

    // 3. Send the email notification
    try {
        await emailjs.send(
            emailJsConfig.serviceId,
            emailJsConfig.templateId,
            {
                readable_date: readableDate,
                submitted_time: submittedTime
            }
        );

        console.log("Email notification sent successfully.");
    } catch (emailError) {
        console.error(
            "Date was saved, but the email notification failed:",
            emailError
        );
    }

    // 4. Show success on the website
    showDateMessage(
        `${readableDate} has been selected. Adventure confirmed!`,
        "success"
    );

    confirmButton.querySelector("span:first-child").textContent =
        "Adventure Date Confirmed";

    confirmButton.disabled = true;
    dateInput.disabled = true;

        localStorage.setItem(
    "confirmedAdventureDate",
    selectedDate
    );

    launchDateConfetti();
    startAdventureCountdown(selectedDate);

} catch (error) {
    console.error("Error saving date:", error);

    showDateMessage(
        "The date could not be saved. Please try again.",
        "error"
    );

    confirmButton.disabled = false;

    confirmButton.querySelector("span:first-child").textContent =
        "Confirm Adventure Date";
}
});


function formatSelectedDate(dateValue) {
    const selectedDate = new Date(`${dateValue}T00:00:00`);

    return selectedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function showDateMessage(message, type) {
    dateMessage.textContent = message;
    dateMessage.classList.remove("success", "error");

    if (type) {
        dateMessage.classList.add(type);
    }
}


/* =================================
   SMALL CONFETTI EFFECT
================================= */

function launchDateConfetti() {
    const symbols = ["✦", "●", "▲", "■"];

    for (let index = 0; index < 35; index++) {
        const confetti = document.createElement("span");

        confetti.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        confetti.style.position = "fixed";
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = "-30px";
        confetti.style.zIndex = "9999";
        confetti.style.pointerEvents = "none";
        confetti.style.fontSize = `${10 + Math.random() * 13}px`;
        confetti.style.color =
            Math.random() > 0.5 ? "#35aeea" : "#f2c624";
        confetti.style.transition =
            `transform ${2 + Math.random() * 2}s linear,
             opacity ${2 + Math.random() * 2}s ease`;

        document.body.appendChild(confetti);

        requestAnimationFrame(() => {
            confetti.style.transform =
                `translateY(110vh) rotate(${Math.random() * 720}deg)`;

            confetti.style.opacity = "0";
        });

        setTimeout(() => {
            confetti.remove();
        }, 4200);
    }
}
function startAdventureCountdown(dateValue) {

    clearInterval(countdownInterval);

    const targetDate = new Date(`${dateValue}T00:00:00`);

    countdownCard.hidden = false;

    function updateNumber(element, value) {

        const formattedValue = String(value).padStart(2, "0");

        if (element.textContent !== formattedValue) {

            element.classList.add("countdown-tick");

            setTimeout(() => {
                element.textContent = formattedValue;
                element.classList.remove("countdown-tick");
            }, 120);

        }
    }

    function updateCountdown() {

        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {

            clearInterval(countdownInterval);

            countdownCard.innerHTML = `
                <div class="countdown-icon">🌊</div>

                <div class="countdown-complete">
                    Today is the day!<br>
                    Our Varkala adventure begins now ✨
                </div>
            `;

            launchDateConfetti();

            return;
        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (difference % (1000 * 60)) /
            1000
        );

        updateNumber(countdownDays, days);
        updateNumber(countdownHours, hours);
        updateNumber(countdownMinutes, minutes);
        updateNumber(countdownSeconds, seconds);
    }

    updateCountdown();

    countdownInterval = setInterval(
        updateCountdown,
        1000
    );
}
const savedAdventureDate =
    localStorage.getItem("confirmedAdventureDate");

if (savedAdventureDate) {

    dateInput.value = savedAdventureDate;
    dateInput.disabled = true;
    confirmButton.disabled = true;

    confirmButton
        .querySelector("span:first-child")
        .textContent = "Adventure Date Confirmed";

    showDateMessage(
        `${formatSelectedDate(savedAdventureDate)} has been selected.`,
        "success"
    );

    startAdventureCountdown(savedAdventureDate);
}
