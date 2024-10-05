const Copyright = () => {
  return (
    <div className="flex gap-4 text-sm items-center justify-center py-4 bg-slate-900 text-white/80">
      <span>
        &copy; {new Date().getFullYear()} Festify Web Services. All rights
        reserved.
      </span>
    </div>
  );
};

export default Copyright;
