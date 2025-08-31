import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { CodeEditor } from './CodeEditor';
import { MultipleChoiceView } from './MultipleChoiceView';
import { FillInBlankView } from './FillInBlankView';
import { CodingProblem } from '../types/leetcode';
import { CheckCircle, XCircle, Lightbulb, Trophy, Zap, BookOpen, PenTool, Code2 } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

interface ProblemModalProps {
  problem: CodingProblem | null;
  isOpen: boolean;
  onClose: () => void;
  onSolve: (problemId: string, earnedXP: number, earnedMoney: number) => void;
}

type LearningStage = 'multiple-choice' | 'fill-blank' | 'coding';

export const ProblemModal = ({ problem, isOpen, onClose, onSolve }: ProblemModalProps) => {
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentStage, setCurrentStage] = useState<LearningStage>('multiple-choice');
  const [completedStages, setCompletedStages] = useState<Set<LearningStage>>(new Set());
  const [totalEarnedXP, setTotalEarnedXP] = useState(0);
  const [totalEarnedMoney, setTotalEarnedMoney] = useState(0);

  if (!problem) return null;

  const handleStageComplete = (stage: LearningStage, xpEarned: number, moneyEarned: number) => {
    setCompletedStages(new Set([...completedStages, stage]));
    setTotalEarnedXP(totalEarnedXP + xpEarned);
    setTotalEarnedMoney(totalEarnedMoney + moneyEarned);
    
    if (stage === 'multiple-choice') {
      setCurrentStage('fill-blank');
    } else if (stage === 'fill-blank') {
      setCurrentStage('coding');
    }
  };

  const getStageRewards = (stage: LearningStage) => {
    const baseXP = problem.xpReward;
    const baseMoney = problem.moneyReward;
    
    switch (stage) {
      case 'multiple-choice':
        return { xp: Math.floor(baseXP * 0.2), money: Math.floor(baseMoney * 0.2) };
      case 'fill-blank':
        return { xp: Math.floor(baseXP * 0.3), money: Math.floor(baseMoney * 0.3) };
      case 'coding':
        return { xp: Math.floor(baseXP * 0.5), money: Math.floor(baseMoney * 0.5) };
      default:
        return { xp: 0, money: 0 };
    }
  };

  const getProgressPercentage = () => {
    const stages = ['multiple-choice', 'fill-blank', 'coding'];
    const currentIndex = stages.indexOf(currentStage);
    const completedCount = completedStages.size;
    return Math.min(100, (completedCount / 3) * 100 + (currentIndex / 3) * 33);
  };

  const validateSolution = (code: string, language: string) => {
    setIsRunning(true);
    setTestResults([]);

    // Simulate code execution (in a real app, this would be sent to a backend)
    setTimeout(() => {
      try {
        // Create a function from the code string
        const func = new Function('return ' + code)();
        
        const results = problem.testCases.map((testCase, index) => {
          try {
            // Parse the input based on the problem
            let result: any;
            let input = testCase.input;
            
            // Simple parser for different input formats
            if (problem.id === 'two-sum') {
              const [nums, target] = input.split('\n');
              result = func(JSON.parse(nums), parseInt(target));
            } else if (problem.id === 'palindrome-number' || problem.id === 'fizzbuzz' || problem.id === 'climbing-stairs') {
              result = func(parseInt(input));
            } else if (problem.id === 'reverse-string' || problem.id === 'valid-parentheses') {
              result = func(JSON.parse(input));
            } else if (problem.id === 'binary-search') {
              const [nums, target] = input.split('\n');
              result = func(JSON.parse(nums), parseInt(target));
            } else if (problem.id === 'best-time-to-buy-and-sell-stock' || problem.id === 'maximum-subarray') {
              result = func(JSON.parse(input));
            } else if (problem.id === 'merge-sorted-array') {
              const [nums1, m, nums2, n] = input.split('\n');
              const arr = JSON.parse(nums1);
              func(arr, parseInt(m), JSON.parse(nums2), parseInt(n));
              result = arr;
            } else {
              result = func(JSON.parse(input));
            }

            // Convert result to string for comparison
            const resultStr = JSON.stringify(result);
            const passed = resultStr === testCase.expectedOutput || 
                          (typeof result === 'boolean' && result.toString() === testCase.expectedOutput);
            
            return {
              passed,
              message: passed 
                ? `Test case ${index + 1}: Passed ✓` 
                : `Test case ${index + 1}: Failed - Expected ${testCase.expectedOutput}, got ${resultStr}`
            };
          } catch (error) {
            return {
              passed: false,
              message: `Test case ${index + 1}: Runtime error - ${error}`
            };
          }
        });

        setTestResults(results);

        // Check if all tests passed
        const allPassed = results.every(r => r.passed);
        if (allPassed) {
          const stageRewards = getStageRewards('coding');
          const xpPenalty = hintsUsed * 5;
          const moneyPenalty = hintsUsed * 10;
          const stageXP = Math.max(stageRewards.xp - xpPenalty, 5);
          const stageMoney = Math.max(stageRewards.money - moneyPenalty, 10);
          
          const finalXP = totalEarnedXP + stageXP;
          const finalMoney = totalEarnedMoney + stageMoney;
          
          handleStageComplete('coding', stageXP, stageMoney);
          
          toast.success(
            <div className="flex flex-col gap-2">
              <div className="font-semibold">All Stages Complete! 🎉</div>
              <div className="text-sm">
                <div>Total XP Earned: +{finalXP}</div>
                <div>Total Money Earned: +${finalMoney}</div>
                {hintsUsed > 0 && <div className="text-muted-foreground">Some hints used</div>}
              </div>
            </div>
          );
          
          setTimeout(() => {
            onSolve(problem.id, finalXP, finalMoney);
            onClose();
          }, 2000);
        }
      } catch (error) {
        setTestResults([{
          passed: false,
          message: `Syntax error: ${error}`
        }]);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'Hard': return 'bg-red-500/10 text-red-500';
      default: return '';
    }
  };

  const handleShowHint = () => {
    if (hintsUsed < problem.hints.length) {
      setShowHint(true);
      setHintsUsed(hintsUsed + 1);
      toast.info('Hint revealed! XP reward will be reduced.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{problem.title}</DialogTitle>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Badge variant="outline" className="flex gap-1">
                <Trophy className="w-3 h-3" />
                {problem.xpReward} XP Total
              </Badge>
              <Badge variant="outline" className="flex gap-1">
                <Zap className="w-3 h-3" />
                ${problem.moneyReward} Total
              </Badge>
            </div>
          </div>
          <DialogDescription className="mt-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {problem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Progress:</span>
                <Progress value={getProgressPercentage()} className="w-32 h-2" />
                <span className="text-xs">{Math.round(getProgressPercentage())}%</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${currentStage === 'multiple-choice' ? 'bg-primary text-primary-foreground' : completedStages.has('multiple-choice') ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-medium">Multiple Choice</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${currentStage === 'fill-blank' ? 'bg-primary text-primary-foreground' : completedStages.has('fill-blank') ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>
            <PenTool className="w-4 h-4" />
            <span className="text-xs font-medium">Fill in Blanks</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${currentStage === 'coding' ? 'bg-primary text-primary-foreground' : completedStages.has('coding') ? 'bg-green-500/20 text-green-500' : 'bg-muted'}`}>
            <Code2 className="w-4 h-4" />
            <span className="text-xs font-medium">Code Solution</span>
          </div>
          {(totalEarnedXP > 0 || totalEarnedMoney > 0) && (
            <div className="ml-auto text-xs text-muted-foreground">
              Earned: {totalEarnedXP} XP, ${totalEarnedMoney}
            </div>
          )}
        </div>

        {currentStage === 'multiple-choice' && problem.multipleChoice && (
          <div className="mt-4">
            <MultipleChoiceView
              question={problem.multipleChoice.question}
              options={problem.multipleChoice.options}
              correctOptionId={problem.multipleChoice.correctOptionId}
              conceptExplanation={problem.multipleChoice.conceptExplanation}
              onComplete={() => {
                const rewards = getStageRewards('multiple-choice');
                handleStageComplete('multiple-choice', rewards.xp, rewards.money);
              }}
              xpReward={getStageRewards('multiple-choice').xp}
              moneyReward={getStageRewards('multiple-choice').money}
            />
          </div>
        )}

        {currentStage === 'fill-blank' && problem.fillInBlank && (
          <div className="mt-4">
            <FillInBlankView
              description={problem.fillInBlank.description}
              segments={problem.fillInBlank.segments}
              hints={problem.fillInBlank.hints}
              onComplete={() => {
                const rewards = getStageRewards('fill-blank');
                handleStageComplete('fill-blank', rewards.xp, rewards.money);
              }}
              xpReward={getStageRewards('fill-blank').xp}
              moneyReward={getStageRewards('fill-blank').money}
            />
          </div>
        )}

        {currentStage === 'coding' && (
          <Tabs defaultValue="problem" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="results">Test Results</TabsTrigger>
            </TabsList>

          <TabsContent value="problem" className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap">{problem.description}</div>
              
              <h3 className="text-lg font-semibold mt-4">Examples:</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-muted p-3 rounded-lg mt-2">
                  <div className="font-mono text-sm">
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                    {example.explanation && (
                      <div className="mt-1 text-muted-foreground">
                        <strong>Explanation:</strong> {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShowHint}
                  disabled={hintsUsed >= problem.hints.length}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Show Hint ({hintsUsed}/{problem.hints.length})
                </Button>
              </div>

              {showHint && hintsUsed > 0 && (
                <Alert className="mt-2">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Hint {hintsUsed}:</strong> {problem.hints[hintsUsed - 1]}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="code">
            <CodeEditor
              starterCode={problem.starterCode}
              onRun={validateSolution}
              isRunning={isRunning}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-2">
            {testResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Run your code to see test results
              </div>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <Alert
                    key={index}
                    className={result.passed ? 'border-green-500' : 'border-red-500'}
                  >
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <AlertDescription>{result.message}</AlertDescription>
                  </Alert>
                ))}
                
                {testResults.every(r => r.passed) && (
                  <Alert className="border-green-500 bg-green-500/10 mt-4">
                    <Trophy className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500 font-semibold">
                      All test cases passed! You've earned {problem.xpReward - (hintsUsed * 10)} XP and ${problem.moneyReward - (hintsUsed * 20)}!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};