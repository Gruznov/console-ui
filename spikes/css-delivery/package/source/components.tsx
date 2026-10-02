export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 px-3 py-2 font-semibold text-slate-50"
      {...props}
    />
  );
}

export function ConsoleFrame(props: React.PropsWithChildren) {
  return (
    <div className="grid min-h-full grid-cols-[14rem_minmax(0,1fr)] bg-slate-50 text-slate-800">
      <aside className="border-slate-200 bg-white [border-inline-end-width:1px]" />
      <main className="min-w-0 p-4">{props.children}</main>
    </div>
  );
}
