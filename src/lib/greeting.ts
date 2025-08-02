export function getGreeting() {
  const date = new Date();
  const hours = date.getHours();

  let greeting: string;

  if (hours < 6) {
    greeting = "Night";
  } else if (hours < 12) {
    greeting = "Morning";
  } else if (hours < 17) {
    greeting = "Afternoon";
  } else if (hours < 21) {
    greeting = "Evening";
  } else {
    greeting = "Night";
  }

  return `Good ${greeting}.`;
}
