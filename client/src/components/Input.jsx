import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">Full Name</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="size-5 text-base-content/40" />
        </div>
        <input {...props} />
      </div>
    </div>
  );
};

export default Input;
