import { IChartTile } from '@sharedtypes/analog';

interface ChartTileProps {
  tile: IChartTile;
}

const ChartTile = ({ tile }: ChartTileProps) => {
  return (
    <div>
      Chart {tile._id} - {tile.metadata.type}
    </div>
  );
};

export default ChartTile;
