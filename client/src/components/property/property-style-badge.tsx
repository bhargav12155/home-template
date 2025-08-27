import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sparkles } from "lucide-react";

interface PropertyStyleBadgeProps {
  architecturalStyle?: string | null;
  secondaryStyle?: string | null;
  styleConfidence?: string | null;
  styleFeatures?: string[] | null;
  compact?: boolean;
}

export default function PropertyStyleBadge({ 
  architecturalStyle, 
  secondaryStyle, 
  styleConfidence, 
  styleFeatures,
  compact = false 
}: PropertyStyleBadgeProps) {
  if (!architecturalStyle) return null;

  const confidence = styleConfidence ? parseFloat(styleConfidence) : 0;
  const isHighConfidence = confidence >= 0.8;
  
  const badgeContent = (
    <Badge 
      variant="secondary" 
      className={`
        bg-gradient-to-r from-bjork-beige/20 to-bjork-blue/20 
        text-bjork-black border-bjork-beige/30 hover:border-bjork-blue/50
        ${compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1'}
        transition-all duration-200
      `}
    >
      <Sparkles className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1 text-bjork-beige`} />
      {architecturalStyle}
      {isHighConfidence && !compact && (
        <span className="ml-1 text-bjork-blue font-semibold">✓</span>
      )}
    </Badge>
  );

  if (compact) {
    return badgeContent;
  }

  const tooltipDetails = [
    `Primary Style: ${architecturalStyle}`,
    secondaryStyle && `Secondary Style: ${secondaryStyle}`,
    confidence > 0 && `AI Confidence: ${Math.round(confidence * 100)}%`,
    styleFeatures && styleFeatures.length > 0 && `Key Features: ${styleFeatures.slice(0, 3).join(', ')}`
  ].filter(Boolean).join('\n');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            {badgeContent}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-xs space-y-1">
            <div className="font-semibold text-bjork-blue">AI Style Analysis</div>
            <pre className="whitespace-pre-wrap text-gray-600">
              {tooltipDetails}
            </pre>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}