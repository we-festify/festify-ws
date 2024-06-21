interface Colors {
    [key: string]: {
      background: string;
      text: string;
    };
  }
  
  const colors: Colors = {
    get: {
      background: "bg-green-300/10",
      text: "text-green-500",
    },
    post: {
      background: "bg-blue-300/10",
      text: "text-blue-500",
    },
    put: {
      background: "bg-yellow-300/10",
      text: "text-yellow-500",
    },
    delete: {
      background: "bg-red-300/10",
      text: "text-red-500",
    },
    default: {
      background: "bg-gray-300/10",
      text: "text-gray-500",
    },
  };
  
  const APIBadge = ({ method }: { method: string }) => {
    const lowerMethod = method.toLowerCase();
    return (
      <div
        className={`rounded-md p-2 pt-1 pb-1 ${colors[lowerMethod]?.background}`}
      >
        <p className={`text-sm font-semibold ${colors[lowerMethod]?.text}`}>
          {method}
        </p>
      </div>
    );
  };

export default APIBadge;