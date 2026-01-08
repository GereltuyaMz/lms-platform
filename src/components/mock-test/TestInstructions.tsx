type TestInstructionsProps = {
  timeLimit: number;
  passingScore: number;
};

export const TestInstructions = ({ timeLimit }: TestInstructionsProps) => {
  return (
    <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-bold text-blue-900 mb-3">Заавар</h3>
      <ul className="space-y-2 text-sm text-blue-800">
        <li>• Тест нь {timeLimit} минутын хугацаатай</li>
        <li>• Цаг дуусвал тест автоматаар илгээгдэнэ</li>
        <li>• Та ямар ч үед хариултаа солих боломжтой</li>
        <li>• Хариултууд автоматаар хадгалагдана</li>
        <li>• Та тестээ дахин өгөх боломжтой</li>
      </ul>
    </div>
  );
};
