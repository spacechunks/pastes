import { Plus, Copy, FileCode, PenLine, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useFetcher, Link } from 'react-router';
import React, { useEffect, useState, useRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LANGUAGE_MAP } from '@/lib/language';
import { toast } from 'sonner';

type ActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  hotkey?: string;
  to?: string;
  hardRefresh?: boolean;
};

function ActionButton({
  icon,
  label,
  onClick,
  hotkey,
  to,
  hardRefresh,
}: ActionButtonProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleNavigation = () => {
    if (hardRefresh && to) {
      window.location.href = to;
    } else if (linkRef.current) {
      linkRef.current.click();
    }
  };

  React.useEffect(() => {
    if (!hotkey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        if (onClick) {
          onClick();
        } else if (to) {
          handleNavigation();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey, onClick, to, hardRefresh]);

  const tooltipLabel = hotkey
    ? `${label} (Ctrl + ${hotkey.toUpperCase()})`
    : label;

  const buttonContent = <>{icon}</>;

  if (to && hardRefresh) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <a
              href={to}
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-card/80 focus:ring-sidebar-ring/40 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ease-in-out hover:shadow-sm focus:ring-2 focus:outline-none"
            >
              {buttonContent}
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipLabel}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {to ? (
            <Link
              ref={linkRef}
              to={to}
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-card/80 focus:ring-sidebar-ring/40 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ease-in-out hover:shadow-sm focus:ring-2 focus:outline-none"
            >
              {buttonContent}
            </Link>
          ) : (
            <button
              ref={buttonRef}
              onClick={onClick}
              className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-card/80 focus:ring-sidebar-ring/40 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 ease-in-out hover:shadow-sm focus:ring-2 focus:outline-none"
            >
              {buttonContent}
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type FileActionsProps = {
  isNewItem?: boolean;
  paste?: {
    id: string;
    data: string;
    languageId: string;
  };
  className?: string;
  onEdit?: () => void;
  onSave?: () => void;
};

export function useFileSave() {
  const navigate = useNavigate();
  const languageFetcher = useFetcher();
  const pasteFetcher = useFetcher();
  const [pendingCode, setPendingCode] = useState<string | null>(null);
  const [pendingLanguageId, setPendingLanguageId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      pendingCode &&
      !pendingLanguageId &&
      languageFetcher.state === 'idle' &&
      languageFetcher.data
    ) {
      const detectedLanguageId = languageFetcher.data.id || 'txt';
      setPendingLanguageId(detectedLanguageId);

      pasteFetcher.submit(
        {
          data: pendingCode,
          languageId: detectedLanguageId,
        },
        {
          method: 'post',
          action: '/api/pastes/create',
          encType: 'application/json',
        }
      );
    }
  }, [
    languageFetcher.state,
    languageFetcher.data,
    pendingCode,
    pendingLanguageId,
  ]);

  useEffect(() => {
    if (
      pendingCode &&
      pendingLanguageId &&
      pasteFetcher.state === 'idle' &&
      pasteFetcher.data
    ) {
      const pasteId = pasteFetcher.data.id;
      if (pasteId) {
        let urlExtension = 'txt';
        for (const [ext, lang] of Object.entries(LANGUAGE_MAP)) {
          if (lang.id === pendingLanguageId) {
            urlExtension = lang.slug;
            break;
          }
        }
        toast.success('Saved paste');
        navigate(`/${pasteId}.${urlExtension}`);
        // Reset pending state
        setPendingCode(null);
        setPendingLanguageId(null);
      }
    }
  }, [
    pasteFetcher.state,
    pasteFetcher.data,
    pendingCode,
    pendingLanguageId,
    navigate,
  ]);

  const handleSave = async (code: string, currentLanguageId?: string) => {
    if (code.trim() === '') {
      return false;
    }

    try {
      setPendingCode(code);

      if (currentLanguageId) {
        setPendingLanguageId(currentLanguageId);

        pasteFetcher.submit(
          {
            data: code,
            languageId: currentLanguageId,
          },
          {
            method: 'post',
            action: '/api/pastes/create',
            encType: 'application/json',
          }
        );
      } else {
        setPendingLanguageId(null);

        languageFetcher.submit(
          { code },
          {
            method: 'post',
            action: '/api/language/detect',
            encType: 'application/json',
          }
        );
      }

      return true;
    } catch (error) {
      console.error('Error saving paste:', error);
      setPendingCode(null);
      setPendingLanguageId(null);
      return false;
    }
  };

  return {
    handleSave,
    isSaving: pasteFetcher.state !== 'idle' || languageFetcher.state !== 'idle',
  };
}

export function FileActions({
  isNewItem = false,
  paste,
  className,
  onEdit,
  onSave,
}: FileActionsProps) {
  const { isSaving } = useFileSave();

  return (
    <div
      className={cn(
        'bg-sidebar-accent border-border rounded-bt-lg flex items-center gap-2 rounded-bl-lg border-b border-l px-3 py-2',
        className
      )}
    >
      {isNewItem ? (
        <ActionButton
          icon={
            isSaving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Save size={16} strokeWidth={2} />
            )
          }
          label={isSaving ? 'Saving...' : 'Save'}
          onClick={onSave}
          hotkey="s"
        />
      ) : (
        <>
          <ActionButton
            icon={<Plus size={16} strokeWidth={2} />}
            label="New"
            to="/"
            hotkey="n"
          />
          <ActionButton
            icon={<Copy size={16} strokeWidth={2} />}
            label="Copy"
            onClick={() => {
              if (paste) {
                navigator.clipboard.writeText(paste.data);
                toast.success('Copied to clipboard');
              }
            }}
            hotkey="c"
          />
          <ActionButton
            icon={<FileCode size={16} strokeWidth={2} />}
            label="Raw"
            to={paste ? `/raw/${paste.id}.${paste.languageId}` : undefined}
            hardRefresh
            hotkey="r"
          />
          <ActionButton
            icon={<PenLine size={16} strokeWidth={2} />}
            label="Edit"
            onClick={onEdit}
            hotkey="e"
          />
        </>
      )}
    </div>
  );
}
