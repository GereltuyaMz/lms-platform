type BadgeBackgroundProps = {
  width: number;
  height: number;
  c1: string; // Base layer - darkest
  c2: string; // Second layer
  c3: string; // Diagonal shine stripes - lightest
  c4: string; // Frame shadow
  className?: string;
};

export const BadgeBackground = ({
  width,
  height,
  c1,
  c2,
  c3,
  c4,
  className = "",
}: BadgeBackgroundProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 73 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Base layer - darkest */}
      <path
        d="M14 0H59C66.732 0 73 6.26801 73 14V76C73 83.732 66.732 90 59 90H14C6.26801 90 0 83.732 0 76V14C0 6.26801 6.26801 0 14 0Z"
        fill={c1}
      />
      {/* Second layer */}
      <path
        d="M14 0H59C66.732 0 73 6.26801 73 14V72C73 79.732 66.732 86 59 86H14C6.26801 86 0 79.732 0 72V14C0 6.26801 6.26801 0 14 0Z"
        fill={c2}
      />
      {/* Diagonal stripe 1 */}
      <path
        d="M72.6892 11.0525L72.673 10.9781C72.749 11.3235 72.8123 11.6738 72.8623 12.0283C72.9316 12.5202 72.9754 13.0204 72.9922 13.5273L73 14V42.8242L29.3449 85.9991L14 86C9.33813 86 5.20845 83.7214 2.66394 80.2172L72.673 10.9781C72.6785 11.0031 72.6839 11.0278 72.6892 11.0525Z"
        fill={c3}
      />
      {/* Diagonal stripe 2 */}
      <path
        d="M33.4472 0H59C61.0437 0 62.9851 0.437899 64.7355 1.22499L26.5217 39.0189C22.0412 43.4502 14.8289 43.4502 10.3484 39.0189L10.3033 38.9743C5.86162 34.5815 5.82206 27.4196 10.2149 22.978C10.2442 22.9483 10.2737 22.9189 10.3033 22.8896L33.4472 0Z"
        fill={c3}
      />
      {/* Tilted frame shadow */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6956 18.6939L51.565 10.1365C53.0052 9.74983 54.4861 10.6038 54.8728 12.044L54.8736 12.0467L64.1087 46.5855C64.4936 48.0249 63.6396 49.5041 62.2006 49.8905L30.3312 58.4479C28.891 58.8346 27.4101 57.9806 27.0234 56.5404L27.0226 56.5377L17.7874 21.999C17.4025 20.5595 18.2565 19.0803 19.6956 18.6939Z"
        fill={c4}
      />
      {/* Main frame outer */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.7 9H55.1571C56.6483 9 57.8571 10.2088 57.8571 11.7V51.9316C57.8571 53.4227 56.6483 54.6316 55.1571 54.6316H17.7C16.2088 54.6316 15 53.4227 15 51.9316V11.7C15 10.2088 16.2088 9 17.7 9Z"
        fill={c1}
      />
      {/* Main frame inner */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.2643 13.4737H51.5928C52.587 13.4737 53.3929 14.2796 53.3929 15.2737V41.2C53.3929 42.1941 52.587 43 51.5928 43H21.2643C20.2702 43 19.4643 42.1941 19.4643 41.2V15.2737C19.4643 14.2796 20.2702 13.4737 21.2643 13.4737Z"
        fill={c2}
      />
    </svg>
  );
};
