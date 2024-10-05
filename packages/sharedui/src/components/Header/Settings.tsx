import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../primitives/popover';
import { Settings as SettingsIcon } from 'lucide-react';
import { Theme, themes, useTheme } from '@rootui/providers/ThemeProvider';
import { RadioGroup, RadioGroupItem } from '../../primitives//radio-group';
import { Label } from '../../primitives/label';

const Settings = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 p-2 rounded-sm text-xs cursor-pointer text-white/90 hover:bg-slate-800">
          <SettingsIcon size={16} />
          <span>Settings</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 px-2 shadow-none rounded-none ring-0 border-0 bg-transparent max-w-none">
        <div className="bg-slate-900 text-slate-200 shadow-md text-muted p-4 rounded-md w-max min-w-60">
          <div className="mb-3 text-sm text-slate-400">Visual mode</div>
          <div className="space-y-3">
            <RadioGroup
              name="theme"
              value={theme}
              onValueChange={(value: Theme) => setTheme(value)}
            >
              {themes.map((theme) => (
                <div key={theme} className="flex gap-4">
                  <RadioGroupItem
                    value={theme}
                    id={theme}
                    className="bg-slate-600 text-slate-900 dark:border-0"
                  />
                  <Label htmlFor={theme} className="capitalize">
                    {theme}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Settings;
