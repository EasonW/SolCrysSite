// Tiny inline trend sparkline. `values` are pre-normalized to 0..1
// (chronological) by the public-view generator — no absolute magnitude.
interface SparklineProps {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}

const Sparkline = ({ values, color, width = 104, height = 26 }: SparklineProps) => {
  if (!values || values.length < 2) {
    return <svg width={width} height={height} aria-hidden="true" />;
  }
  const n = values.length;
  const coords = values.map((v, i) => {
    const x = (i / (n - 1)) * (width - 4) + 2;
    const y = height - 3 - v * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const [lastX, lastY] = coords[coords.length - 1].split(",");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block align-middle"
      aria-hidden="true"
    >
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={coords.join(" ")} />
      <circle cx={lastX} cy={lastY} r={2} fill={color} />
    </svg>
  );
};

export default Sparkline;
