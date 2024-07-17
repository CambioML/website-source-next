import usePlaygroundStore from '@/app/hooks/usePlaygroundStore';
import CheckBox from '../inputs/CheckBox';

interface ExtractSettingsChecklistProps {
  removePIIOnly?: boolean;
}

const ExtractSettingsChecklist = ({ removePIIOnly }: ExtractSettingsChecklistProps) => {
  const { extractSettings, toggleExtractSetting } = usePlaygroundStore();
  return (
    <div
      className={`relative flex flex-col items-start justify-center gap-4 border-[1px] border-neutral-200 rounded-lg p-4 w-full ${removePIIOnly ? 'mt-[200px]' : 'mt-[350px]'} shadow-md max-w-[350px] md:max-w-[200px]`}
    >
      <div className="font-semibold text-sm text-sky-500">Remove from output:</div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
        <CheckBox
          label="Personal Identifiable Information (PII)"
          checked={extractSettings.removePII}
          onChange={() => toggleExtractSetting('removePII')}
          alternateColor
        />
        {!removePIIOnly && (
          <>
            <CheckBox
              label="Page Numbers"
              checked={!extractSettings.includePageNumbers}
              onChange={() => toggleExtractSetting('includePageNumbers')}
              alternateColor
            />
            <CheckBox
              label="Footnotes"
              checked={!extractSettings.includeFootnotes}
              onChange={() => toggleExtractSetting('includeFootnotes')}
              alternateColor
            />
            <CheckBox
              label="Headers & Footers"
              checked={!extractSettings.includeHeadersFooters}
              onChange={() => toggleExtractSetting('includeHeadersFooters')}
              alternateColor
            />
            <CheckBox
              label="Tables"
              checked={!extractSettings.includeTables}
              onChange={() => toggleExtractSetting('includeTables')}
              alternateColor
            />
            <CheckBox
              label="Charts & Figures"
              checked={!extractSettings.includeChartsFigures}
              onChange={() => toggleExtractSetting('includeChartsFigures')}
              alternateColor
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ExtractSettingsChecklist;
