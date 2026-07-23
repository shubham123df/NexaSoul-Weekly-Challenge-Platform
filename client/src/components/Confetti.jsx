import confetti from 'canvas-confetti';

export function fireConfetti() {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedDevice = window.innerWidth < 768 || connection?.saveData || navigator.deviceMemory <= 2;
  const colors = ['#00BFFF', '#0099FF', '#32CD32', '#ADFF2F'];

  confetti({
    particleCount: constrainedDevice ? 45 : 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true,
  });

  if (constrainedDevice) return;

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      disableForReducedMotion: true,
    });
  }, 250);
}
