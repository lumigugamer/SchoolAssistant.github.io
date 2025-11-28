// Abrir modal
document.getElementById("saibaMaisBtn").onclick = function() {
  document.getElementById("modal").style.display = "flex";
};

// Fechar modal
document.querySelector(".close").onclick = function() {
  document.getElementById("modal").style.display = "none";
};

// Fechar ao clicar fora
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) modal.style.display = "none";
};
