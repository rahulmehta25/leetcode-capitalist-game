import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Lightbulb, Code2, HelpCircle, Sparkles } from 'lucide-react';
import { FillInBlankSegment } from '../types/leetcode';
import { Progress } from './ui/progress';

interface FillInBlankViewProps {
  description: string;
  segments: FillInBlankSegment[];
  hints: string[];
  onComplete: () => void;
  xpReward: number;
  moneyReward: number;
}

export const FillInBlankView = ({
  description,
  segments,
  hints,
  onComplete,
  xpReward,
  moneyReward,
}: FillInBlankViewProps) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    setAttempts(attempts + 1);
  };

  const checkAnswers = () => {
    let allCorrect = true;
    segments.forEach((segment, index) => {
      if (segment.isBlank && segment.answer) {
        const userAnswer = answers[index]?.trim().toLowerCase();
        const correctAnswer = segment.answer.toLowerCase();
        if (userAnswer !== correctAnswer) {
          allCorrect = false;
        }
      }
    });
    return allCorrect;
  };

  const isCorrect = hasSubmitted && checkAnswers();
  
  const getProgress = () => {
    const blankSegments = segments.filter(s => s.isBlank);
    const filledBlanks = blankSegments.filter((_, index) => {
      const segmentIndex = segments.findIndex((s, i) => s.isBlank && segments.slice(0, i).filter(prev => prev.isBlank).length === index);
      return answers[segmentIndex]?.trim().length > 0;
    });
    return (filledBlanks.length / blankSegments.length) * 100;
  };

  const handleShowHint = () => {
    setShowHint(true);
    if (hintIndex < hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Stage 2: Fill in the Blanks
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Progress:</span>
            <Progress value={getProgress()} className="w-24 h-2" />
            <span className="text-xs">{Math.round(getProgress())}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete the solution by filling in the missing parts (Rewards: {xpReward} XP, ${moneyReward})
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p>{description}</p>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
        <div className="flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4" />
          <span className="text-xs text-muted-foreground">Complete the code:</span>
        </div>
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center flex-wrap gap-1">
              {segment.isBlank ? (
                <div className="inline-flex items-center relative">
                  <Input
                    type="text"
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    onFocus={() => setFocusedInput(index)}
                    onBlur={() => setFocusedInput(null)}
                    placeholder={segment.placeholder || 'Fill in...'}
                    disabled={hasSubmitted}
                    className={`inline-block w-auto min-w-[150px] h-8 px-2 font-mono text-sm transition-all ${
                      hasSubmitted
                        ? answers[index]?.trim().toLowerCase() === segment.answer?.toLowerCase()
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-red-500 bg-red-500/10'
                        : focusedInput === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : ''
                    }`}
                  />
                  {focusedInput === index && !hasSubmitted && segment.placeholder && (
                    <div className="absolute -top-8 left-0 z-10 px-2 py-1 bg-primary text-primary-foreground text-xs rounded">
                      <HelpCircle className="w-3 h-3 inline mr-1" />
                      {segment.placeholder}
                    </div>
                  )}
                  {hasSubmitted && segment.answer && (
                    <span className="ml-2">
                      {answers[index]?.trim().toLowerCase() === segment.answer.toLowerCase() ? (
                        <CheckCircle className="w-4 h-4 text-green-500 inline" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 inline" />
                          <span className="text-xs text-muted-foreground ml-1">
                            (Expected: <code className="text-green-500">{segment.answer}</code>)
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              ) : (
                <pre className="inline whitespace-pre-wrap">{segment.text}</pre>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {!hasSubmitted && (
          <Button
            variant="outline"
            onClick={handleShowHint}
            disabled={hintIndex >= hints.length}
            className="flex-1"
          >
            <Lightbulb className="w-4 h-4 mr-1" />
            Show Hint ({hintIndex + 1}/{hints.length})
          </Button>
        )}
        {!hasSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className="flex-1"
          >
            Check Answers
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            className="w-full"
            variant={isCorrect ? "default" : "secondary"}
          >
            {isCorrect ? "Continue to Code Challenge" : "Try Coding Challenge Anyway"}
          </Button>
        )}
      </div>

      {showHint && !hasSubmitted && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">Hint {hintIndex + 1}:</span>
            <span className="block mt-1">{hints[hintIndex]}</span>
          </AlertDescription>
        </Alert>
      )}

      {hasSubmitted && (
        <Alert className={isCorrect ? "border-green-500" : "border-orange-500"}>
          {isCorrect ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                <span className="font-semibold text-green-500">Perfect!</span>
                <span className="block mt-1">
                  You've earned {xpReward} XP and ${moneyReward}. Ready for the full coding challenge!
                </span>
              </AlertDescription>
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 text-orange-500" />
              <AlertDescription>
                <span className="font-semibold text-orange-500">Some answers need correction.</span>
                <span className="block mt-1">
                  Review the correct answers above. You can still try the coding challenge!
                </span>
              </AlertDescription>
            </>
          )}
        </Alert>
      )}
    </div>
  );
};