export default function Container(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div className="mx-3 items-center">{props.children}</div>
      </div>
    </>
  );
}