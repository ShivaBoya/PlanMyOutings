export default function ThemePicker({ theme, setTheme }) {
  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="default">Default</option>
      <option value="beach">Beach</option>
      <option value="paper">Paper</option>
      <option value="darkpaper">Dark Paper</option>
    </select>
  );
}
