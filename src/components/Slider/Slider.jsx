import React from "react";
import tw from "twin.macro";

const Slider = React.forwardRef(({ label, id, ...restProps }, ref) => (
  <div css={[tw`mb-3 flex flex-col gap-2`]}>
    <label
      css={[tw`text-sm font-bold text-gray-100 text-opacity-80`]}
      htmlFor={id}
    >
      {label}
    </label>
    <input
      {...restProps}
      id={id}
      ref={ref}
      type="range"
      css={tw`w-full h-2 bg-gray-200 accent-gray-800 rounded-lg cursor-pointer`}
    />
  </div>
));

export default Slider;
