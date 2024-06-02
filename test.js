const generateAllDiamondNumbers = () => {
  const allRepeatNumbers = Array.from({ length: 10 }, () =>
    Array(10).fill("0").join("")
  );
  const ascendingSeqNumbers = [
    Array.from({ length: 10 }, (_, i) => i).join(""),
  ];
  const descendingSeqNumbers = [
    Array.from({ length: 10 }, (_, i) => 9 - i).join(""),
  ];

  const nineRepeatNumbers = [];
  for (let i = 0; i < 90; i++) {
    const randDigit = Math.floor(Math.random() * 10);
    const num = Array(10).fill(randDigit).join("");
    nineRepeatNumbers.push(num);
  }

  const nineAscendingSeqNumbers = [];
  for (let i = 0; i < 10; i++) {
    const randStart = Math.floor(Math.random() * 10);
    const num = Array.from({ length: 10 }, (_, j) => (j + randStart) % 10).join(
      ""
    );
    nineAscendingSeqNumbers.push(num);
  }

  const nineDescendingSeqNumbers = [];
  for (let i = 0; i < 10; i++) {
    const randStart = Math.floor(Math.random() * 10);
    const num = Array.from(
      { length: 10 },
      (_, j) => (randStart - j + 10) % 10
    ).join("");
    nineDescendingSeqNumbers.push(num);
  }

  console.log("All 10 digits are repeats:");
  console.log(allRepeatNumbers);

  console.log("All 10 digits form an ascending sequence:");
  console.log(ascendingSeqNumbers);

  console.log("All 10 digits form a descending sequence:");
  console.log(descendingSeqNumbers);

  console.log("9 out of 10 digits are repeats:");
  console.log(nineRepeatNumbers);

  console.log("9 out of 10 digits form an ascending sequence:");
  console.log(nineAscendingSeqNumbers);

  console.log("9 out of 10 digits form a descending sequence:");
  console.log(nineDescendingSeqNumbers);

  console.log("Total Diamond Edition numbers: 122");
};

generateAllDiamondNumbers();
