import Image from "next/image";

/** Map a /start stage step (1–7) onto the five-block hero stack. */
export function stackIndexForStep(step: number) {
  if (step <= 1) return 0;
  if (step <= 4) return 1;
  if (step === 5) return 2;
  if (step === 7) return 3;
  return 4;
}

const STACK_IMAGES = [
  {
    src: "/start/stack-01-register.jpg",
    alt: "Groundwork stack with Register highlighted",
  },
  {
    src: "/start/stack-02-setup.jpg",
    alt: "Groundwork stack with Set up highlighted",
  },
  {
    src: "/start/stack-03-paid.jpg",
    alt: "Groundwork stack with Get paid highlighted",
  },
  {
    src: "/start/stack-04-found.jpg",
    alt: "Groundwork stack with Get found highlighted",
  },
  {
    src: "/start/stack-05-grow.jpg",
    alt: "Groundwork stack with Grow highlighted",
  },
] as const;

type Props = {
  activeIndex: number;
  className?: string;
};

export function StageProgressStack({ activeIndex, className = "" }: Props) {
  const image = STACK_IMAGES[Math.min(Math.max(activeIndex, 0), STACK_IMAGES.length - 1)];

  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <div className="relative mx-auto w-full max-w-[340px]">
        <Image
          src={image.src}
          alt={image.alt}
          width={848}
          height={1024}
          className="h-auto w-full"
          sizes="(max-width: 899px) 0px, 340px"
          priority={activeIndex === 0}
        />
      </div>
    </div>
  );
}
