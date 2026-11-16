/**
 * rewards.js — Distribuição e exibição das recompensas
 */

const TOTAL_REWARD = 850;
const NUM_QUESTIONS = 11;

// Som de dinheiro
const moneySound = new Audio('media/cash.mp3');
moneySound.volume = 0.6;

// Gera distribuição fixa para somar exatamente 850
function generateRewards() {
  const rewardPerQuestion = TOTAL_REWARD / NUM_QUESTIONS;
  return new Array(NUM_QUESTIONS).fill(rewardPerQuestion);
}

// Referências ao DOM
const rewardModal       = document.getElementById('reward-modal');
const rewardValue       = document.getElementById('reward-value');
const continueRewardBtn = document.getElementById('continue-reward-btn');
const currentBalance    = document.getElementById('current-balance');
const finalModal        = document.getElementById('final-modal');
const totalRewardEl     = document.getElementById('total-reward');
const restartBtn        = document.getElementById('restart-btn');

// Estado
let rewards     = generateRewards();
let totalEarned = 0;

// Anima contagem de número
function animateValue(element, start, end, duration) {
  if (!element) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = formatCurrency(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Exibe modal de recompensa
function showReward(questionIndex) {
  const reward = rewards[questionIndex];
  totalEarned += reward;

  animateValue(currentBalance, totalEarned - reward, totalEarned, 1000);

  rewardValue.textContent = '0.00';
  rewardModal.classList.add('active');

  setTimeout(() => {
    if (typeof startConfetti === 'function') startConfetti();
    moneySound.play().catch(() => {}); 
    animateValue(rewardValue, 0, reward, 1000);
  }, 100);

  const rewardAmountEl = document.querySelector('#reward-modal .reward-amount');
  if (rewardAmountEl && typeof animateElement === 'function') animateElement(rewardAmountEl, 'bounce');
}

// Esconde modal de recompensa
function hideReward() {
  rewardModal.classList.remove('active');
  if (typeof stopConfetti === 'function') stopConfetti();
}

// Exibe modal final
function showFinalReward() {
  totalRewardEl.textContent = '0.00';
  finalModal.classList.add('active');

  setTimeout(() => {
    if (typeof startConfetti === 'function') startConfetti();
    moneySound.play().catch(() => {});
    animateValue(totalRewardEl, 0, TOTAL_REWARD, 2000);
  }, 100);

  const finalAmountEl = document.querySelector('#final-modal .reward-amount');
  if (finalAmountEl && typeof animateElement === 'function') animateElement(finalAmountEl, 'bounce');
}

// Esconde modal final
function hideFinalReward() {
  finalModal.classList.remove('active');
  if (typeof stopConfetti === 'function') stopConfetti();
}

// Event listeners
continueRewardBtn.addEventListener('click', () => {
  hideReward();
  nextQuestion();
});

restartBtn.addEventListener('click', () => {
  hideFinalReward();
  showPage('withdraw');
});
