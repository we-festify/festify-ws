import { ChartConfigSection } from '@analog-ui/types/chart-config';
import { ChartType } from '@analog-ui/types/charts';

const commonConfigSections: ChartConfigSection[] = [
  {
    title: 'Title',
    properties: [
      { label: 'Text', type: 'string', key: 'title.text' },
      {
        label: 'Font Weight',
        type: 'enum',
        options: ['normal', 'bold', 'bolder', 'lighter'],
        key: 'title.textStyle.fontWeight',
        default: 'bold',
      },
      { label: 'Link', type: 'string', key: 'title.link' },
    ],
  },
  {
    title: 'Legend',
    properties: [
      {
        label: 'Show',
        type: 'boolean',
        key: 'legend.show',
        default: false,
      },
      {
        label: 'Align direction',
        type: 'direction',
        key: ['legend.left', 'legend.top'],
        options: [
          ['left', 'center', 'right'],
          ['30', 'center', 'bottom'], // 30 from top to avoid title overlap
        ],
        default: ['center', '30'],
      },
      {
        label: 'Orient',
        type: 'enum',
        options: ['horizontal', 'vertical'],
        key: 'legend.orient',
        default: 'horizontal',
      },
      {
        label: 'Icon',
        type: 'enum',
        options: [
          'circle',
          'rect',
          'roundRect',
          'triangle',
          'diamond',
          'pin',
          'arrow',
          'none',
        ],
        key: 'legend.icon',
        default: 'roundRect',
      },
    ],
  },
  {
    title: 'Tooltip',
    properties: [
      {
        label: 'Show',
        type: 'boolean',
        key: 'tooltip.show',
        default: false,
      },
      {
        label: 'Trigger',
        type: 'enum',
        options: ['item', 'axis', 'none'],
        key: 'tooltip.trigger',
        default: 'item',
      },
    ],
  },
] as const;

const barConfigSections: ChartConfigSection[] = [];
const pieConfigSections: ChartConfigSection[] = [];
const lineConfigSections: ChartConfigSection[] = [];

/**
 * Merge common and specific sections
 * @private not to be used outside this file
 */
const mergeSections = (
  common: ChartConfigSection[],
  specific: ChartConfigSection[],
): ChartConfigSection[] => {
  return common.map((section) => {
    const specificSection = specific.find((s) => s.title === section.title);
    if (!specificSection) return section;

    const overlappingKeys = section.properties
      .map((p) => p.key)
      .filter((key) => specificSection.properties.some((p) => p.key === key));

    return {
      title: section.title,
      properties: [
        ...section.properties.filter((p) => !overlappingKeys.includes(p.key)),
        ...specificSection.properties,
      ],
    };
  });
};

export const ChartConfigSections: Record<ChartType, ChartConfigSection[]> = {
  bar: mergeSections(commonConfigSections, barConfigSections),
  pie: mergeSections(commonConfigSections, pieConfigSections),
  line: mergeSections(commonConfigSections, lineConfigSections),
} as const;
