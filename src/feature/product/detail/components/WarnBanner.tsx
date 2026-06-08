//will need to accept product attribute type item|pattern and display the appropriate warning

const WarnBanner = () => {
  return (
    <div className="bg-amber-100 border border-amber-400 text-amber-900 m-2 rounded-md text-sm p-4">
      Banner component displaying a warning/information that item being viewed
      is either only a pattern, or fully made item
    </div>
  );
};

export default WarnBanner;
