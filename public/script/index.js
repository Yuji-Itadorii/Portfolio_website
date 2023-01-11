var count = 0.5;
for (let i = 0; i < 12; i++) {
  switch (i) {
    case 0:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset * 0.1}px`;
      });
      break;
    case 1:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `${offset * 0.1}px`;
      });
      break;
    case 2:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset * 0.6}px`;
      });
      break;
    case 3:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `${offset * 0.6}px`;
      });
      break;
    case 4:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset * 0.7}px`;
      });
      break;
    case 5:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `${offset * 0.7}px`;
      });
      break;
    case 6:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset * 0.7}px`;
      });
      break;
    case 7:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `${offset * 0.7}px`;
      });
      break;
    case 8:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset}px`;
      });
      break;
    case 9:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset}px`;
      });
      break;
    case 10:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `-${offset}px`;
      });
      break;
    case 11:
      window.addEventListener("scroll", () => {
        let offset = window.scrollY;
        document.getElementById(`img_${i}`).style.left = `${offset}px`;
      });
      break;
    default:
      break;
  }
}


