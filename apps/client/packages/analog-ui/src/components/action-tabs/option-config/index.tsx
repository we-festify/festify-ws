import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@sharedui/primitives/accordion';
import { useCanvas } from '../../canvas/provider';
import { selectTileById, updateTile } from '@analog-ui/store/canvas';
import { useDispatch, useSelector } from 'react-redux';
import { get, set } from '@sharedui/utils/object';
import { ChartConfigSections } from '@analog-ui/constants/config';
import TextInput from './text-input';
import EnumInput from './enum-input';
import BooleanInput from './boolean-input';
import DirectionInput from './direction-input';

const OptionConfig = () => {
  const { activeTileId } = useCanvas();
  const tile = useSelector(selectTileById(activeTileId ?? ''));
  const dispatch = useDispatch();

  if (!tile || tile.type !== 'chart')
    return <div>No tile selected to configure</div>;
  const option = tile.metadata.option;

  const updateOptionValues = (
    keys: string | string[],
    values: unknown | unknown[],
  ) => {
    if (!Array.isArray(keys)) keys = [keys];
    if (!Array.isArray(values)) values = [values];

    const newOption = keys.reduce((acc, key, index) => {
      return set(acc, key, (values as unknown[])[index]);
    }, option);

    dispatch(
      updateTile({
        ...tile,
        metadata: {
          ...tile.metadata,
          option: newOption,
        },
      }),
    );
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {ChartConfigSections[tile.metadata.type].map((section) => (
        <AccordionItem key={section.title} value={section.title} className="">
          <AccordionTrigger className="px-4 py-3 text-sm bg-muted">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="p-4 pb-8 space-y-4 dark:bg-background/70">
            {section.properties.map((property) =>
              property.type === 'string' ? (
                <TextInput
                  key={property.key}
                  value={get(option, property.key, property.default) as string}
                  onValueChange={(value) =>
                    updateOptionValues(property.key, value)
                  }
                  label={property.label}
                />
              ) : property.type === 'enum' ? (
                <EnumInput
                  key={property.key}
                  value={get(option, property.key, property.default) as string}
                  onValueChange={(value) =>
                    updateOptionValues(property.key, value)
                  }
                  label={property.label}
                  options={property.options ?? []}
                />
              ) : property.type === 'boolean' ? (
                <BooleanInput
                  key={property.key}
                  value={get(option, property.key, property.default) as boolean}
                  onValueChange={(value) =>
                    updateOptionValues(property.key, value)
                  }
                  label={property.label}
                />
              ) : property.type === 'direction' ? (
                <DirectionInput
                  key={property.key.toString()}
                  value={[
                    get(option, property.key[0], property.default[0]) as string,
                    get(option, property.key[1], property.default[1]) as string,
                  ]}
                  onValueChange={(value) =>
                    updateOptionValues(property.key, value)
                  }
                  label={property.label}
                  options={property.options ?? [[], []]}
                />
              ) : null,
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default OptionConfig;
