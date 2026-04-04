// Fisher-Yates Shuffle
export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const calculateScore = (answers, questions) => {
    let score = 0;
    answers.forEach((ans) => {
        const question = questions.find(q => q.$id === ans.questionId);
        if (question && question.correctAnswer === ans.selectedOption) {
            score += 1;
        }
    });
    return score;
};
