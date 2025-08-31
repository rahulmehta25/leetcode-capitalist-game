import { useState } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Lightbulb, Code2, Clock, Database } from 'lucide-react';
import { MultipleChoiceOption } from '../types/leetcode';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MultipleChoiceViewProps {
  question: string;
  options: MultipleChoiceOption[];
  correctOptionId: string;
  conceptExplanation: string;
  onComplete: () => void;
  xpReward: number;
  moneyReward: number;
}

export const MultipleChoiceView = ({
  question,
  options,
  correctOptionId,
  conceptExplanation,
  onComplete,
  xpReward,
  moneyReward,
}: MultipleChoiceViewProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;
    setHasSubmitted(true);
    setShowExplanation(true);
  };

  const isCorrect = selectedOption === correctOptionId;
  const selectedOptionData = options.find(opt => opt.id === selectedOption);

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Stage 1: Multiple Choice</h3>
        <p className="text-sm text-muted-foreground">
          Test your understanding of the problem approach (Rewards: {xpReward} XP, ${moneyReward})
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="font-medium">{question}</p>
      </div>

      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
        disabled={hasSubmitted}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={`flex items-start space-x-2 p-3 rounded-lg border ${
              hasSubmitted
                ? option.id === correctOptionId
                  ? 'border-green-500 bg-green-500/10'
                  : option.id === selectedOption && !isCorrect
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-border'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer font-normal"
            >
              <div className="space-y-2">
                <span className="block font-medium">{option.text}</span>
                
                {option.codeSnippet && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border/50">
                    <div className="bg-muted/30 px-2 py-1 flex items-center gap-2 border-b border-border/50">
                      <Code2 className="w-3 h-3" />
                      <span className="text-xs text-muted-foreground">
                        {option.language || 'javascript'}
                      </span>
                    </div>
                    <SyntaxHighlighter
                      language={option.language || 'javascript'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: '0.5rem',
                        fontSize: '0.75rem',
                        lineHeight: '1.4',
                        backgroundColor: 'transparent'
                      }}
                    >
                      {option.codeSnippet}
                    </SyntaxHighlighter>
                  </div>
                )}
                
                {(option.timeComplexity || option.spaceComplexity) && (
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {option.timeComplexity && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Time: {option.timeComplexity}</span>
                      </div>
                    )}
                    {option.spaceComplexity && (
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>Space: {option.spaceComplexity}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {hasSubmitted && option.id === selectedOption && (
                  <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                    <span className="block text-muted-foreground">
                      {option.explanation}
                    </span>
                  </div>
                )}
              </div>
            </Label>
            {hasSubmitted && (
              <div className="ml-2">
                {option.id === correctOptionId ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : option.id === selectedOption ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
        ))}
      </RadioGroup>

      {!hasSubmitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="w-full"
        >
          Submit Answer
        </Button>
      ) : (
        <div className="space-y-4">
          {isCorrect ? (
            <Alert className="border-green-500">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <span className="font-semibold text-green-500">Correct!</span>
                <span className="block mt-1">
                  You've earned {xpReward} XP and ${moneyReward}. Let's move to the next stage!
                </span>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-red-500">
              <XCircle className="h-4 w-4 text-red-500" />
              <AlertDescription>
                <span className="font-semibold text-red-500">Not quite right.</span>
                <span className="block mt-1">
                  Review the explanation and try to understand the correct approach.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {showExplanation && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                <span className="font-semibold">Concept Explanation:</span>
                <span className="block mt-1">{conceptExplanation}</span>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={onComplete}
            className="w-full"
            variant={isCorrect ? "default" : "secondary"}
          >
            {isCorrect ? "Continue to Fill in the Blank" : "Try Fill in the Blank Anyway"}
          </Button>
        </div>
      )}
    </div>
  );
};