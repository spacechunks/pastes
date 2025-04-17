import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor, Languages, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LANGUAGE_MAP } from '@/lib/language';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SettingsBarProps {
  language?: string;
  onLanguageChange?: (language: string | undefined) => void;
  className?: string;
  date?: Date;
}

export function SettingsBar({
  language,
  onLanguageChange,
  className,
  date,
}: SettingsBarProps) {
  const { theme, setTheme } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // 60000ms = 1 minute

    return () => clearInterval(interval);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-3 w-3" />;
      case 'light':
        return <Sun className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'light':
        return 'Light';
      default:
        return 'System';
    }
  };

  const cycleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      default:
        setTheme('light');
    }
  };

  const formatDate = (date: Date) => {
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'just now';
    }
  };

  const formatExactDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const currentLanguage = language
    ? Object.values(LANGUAGE_MAP).find((l) => l.id === language)
    : undefined;

  return (
    <div
      className={cn(
        'border-border bg-card flex items-center justify-between gap-1 border-t px-2 py-1',
        className
      )}
    >
      {date && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-muted-foreground flex cursor-default items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {formatDate(date)}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" align="start">
              <p className="text-xs">{formatExactDate(date)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2 text-xs"
            >
              <Languages className="h-3 w-3" />
              {currentLanguage?.name || 'Auto'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-0" align="end">
            <Command>
              <CommandInput
                placeholder="Search language..."
                className="h-7 text-xs"
              />
              <CommandList className="max-h-[200px]">
                <CommandEmpty>No languages found</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="auto-detect"
                    onSelect={() => onLanguageChange?.(undefined)}
                    className="aria-selected:text-primary h-6 text-xs"
                  >
                    Auto-detect
                  </CommandItem>
                  {Object.values(LANGUAGE_MAP).map((lang) => (
                    <CommandItem
                      key={lang.id}
                      value={lang.name}
                      onSelect={() => onLanguageChange?.(lang.id)}
                      className={cn(
                        'h-6 text-xs',
                        language === lang.id && 'text-primary'
                      )}
                    >
                      {lang.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="sm"
          onClick={cycleTheme}
          className="h-6 gap-1 px-2 text-xs"
        >
          {getThemeIcon()}
          {getThemeLabel()}
        </Button>
      </div>
    </div>
  );
}
