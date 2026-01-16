"use client";

import { useState } from "react";
import { Book, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MathText } from "@/components/shared/MathText";
import { Card } from "@/components/ui/card";

export const MathGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const examples = [
    {
      title: "Энгийн бутархай",
      latex: "$\\frac{4}{9}$",
      description: "\\frac{4}{9}",
    },
    {
      title: "Холимог тоо",
      latex: "$1\\frac{5}{6}$",
      description: "1\\frac{5}{6}",
    },
    {
      title: "Тэгшитгэл",
      latex: "$\\frac{4}{9}x + 1\\frac{5}{6} = 2$",
      description: "\\frac{4}{9}x + 1\\frac{5}{6} = 2",
    },
    {
      title: "Квадрат язгуур",
      latex: "$\\sqrt{25}$",
      description: "\\sqrt{25}",
    },
    {
      title: "Зэрэг",
      latex: "$x^2 + 2x + 1$",
      description: "x^2 + 2x + 1",
    },
    {
      title: "Индекс",
      latex: "$x_1, x_2, x_3$",
      description: "x_1, x_2, x_3",
    },
    {
      title: "Үржвэр, Хуваах",
      latex: "$a \\times b \\div c$",
      description: "a \\times b \\div c",
    },
    {
      title: "Тэнцэхгүй байх",
      latex: "$x \\neq 0$",
      description: "x \\neq 0",
    },
    {
      title: "Бага/Их буюу тэнцүү",
      latex: "$x \\leq 5 \\geq 3$",
      description: "x \\leq 5 \\geq 3",
    },
    {
      title: "Грек үсэг",
      latex: "$\\alpha, \\beta, \\gamma, \\pi$",
      description: "\\alpha, \\beta, \\gamma, \\pi",
    },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span>LaTeX Математик томъёо бичих заавар</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <Card className="p-4 space-y-4 bg-blue-50 border-blue-200">
          {/* Automatic Conversion Section */}
          <div className="space-y-2 pb-4 border-b border-blue-300">
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              ✨ Автоматаар хөрвүүлэх (Хамгийн хялбар!)
            </p>
            <div className="bg-white p-3 rounded border border-green-300">
              <p className="text-sm text-gray-700 mb-2">
                Зүгээр л энгийнээр бич, талбараас гарахад <span className="font-medium">автоматаар</span> хөрвөнө:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <code className="bg-blue-50 px-2 py-1 rounded text-blue-700">5/9</code>
                  <span>→ Дарах эсвэл Tab</span>
                  <span>→</span>
                  <div className="text-lg"><MathText>{"$\\frac{5}{9}$"}</MathText></div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-50 px-2 py-1 rounded text-blue-700">1 5/6</code>
                  <span>→ Дарах эсвэл Tab</span>
                  <span>→</span>
                  <div className="text-lg"><MathText>{"$1\\frac{5}{6}$"}</MathText></div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-50 px-2 py-1 rounded text-blue-700">x^2</code>
                  <span>→ Дарах эсвэл Tab</span>
                  <span>→</span>
                  <div className="text-lg"><MathText>$x^2$</MathText></div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-50 px-2 py-1 rounded text-blue-700">2^2/3</code>
                  <span>→ Дарах эсвэл Tab</span>
                  <span>→</span>
                  <div className="text-lg"><MathText>{"$2^{\\frac{2}{3}}$"}</MathText></div>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-blue-50 px-2 py-1 rounded text-blue-700">5/x</code>
                  <span>→ Дарах эсвэл Tab</span>
                  <span>→</span>
                  <div className="text-lg"><MathText>{"$\\frac{5}{x}$"}</MathText></div>
                </div>
              </div>
              <p className="text-xs text-green-700 mt-3 font-medium">
                💡 Товч дарах хэрэггүй! Талбараас гарахад шууд хөрвөнө.
              </p>
            </div>
          </div>

          {/* Manual LaTeX Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              Гараар LaTeX бичих (Нарийвчилсан):
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>
                Inline математик: <code className="bg-white px-1 rounded">$томъёо$</code>
              </li>
              <li>
                Block математик: <code className="bg-white px-1 rounded">$$томъёо$$</code>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Жишээнүүд:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-gray-200"
                >
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    {example.title}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-lg">
                      <MathText>{example.latex}</MathText>
                    </div>
                  </div>
                  <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded block">
                    ${example.description}$
                  </code>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-blue-300">
            <p className="text-xs text-gray-600">
              <strong>💡 Зөвлөмж:</strong> Хялбар бутархайн хувьд зүгээр л{" "}
              <code className="bg-white px-1 rounded">5/9</code> гэж бичээд{" "}
              <strong>талбараас гараарай</strong> - автоматаар хөрвөнө!{" "}
              Нарийвчилсан томъёонд л гараар{" "}
              <code className="bg-white px-1 rounded">$\frac{"{5}"}{"{9}"}$</code> гэж бичнэ.
            </p>
          </div>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
