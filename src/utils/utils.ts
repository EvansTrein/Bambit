export const sortAlbums = <T extends object>(albums: T[], key: keyof T, ascending: boolean): T[] => {
  if (!albums.length || !(key in albums[0])) {
    console.error(`Invalid key: ${String(key)}`);
    return albums;
  }

  return albums.sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];

    if (key === "id") {
      const numA = Number(valueA);
      const numB = Number(valueB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return ascending ? numA - numB : numB - numA;
      } else {
        console.error("Error: valueA or valueB cannot be converted to numbers");
        return 0;
      }
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return ascending ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === "string" && typeof valueB === "string") {
      return !ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    return 0;
  });
};

export class IntersectionObserverHelper {
  private observer: IntersectionObserver | null = null;
  private targetElement: HTMLElement | null = null;

  constructor(
    private root: HTMLElement | null = null,
    private threshold: number, // Visibility threshold
    private onIntersect: () => void // Colback at the crossing
  ) {}

  // Начать наблюдение за элементом
  public observe(target: HTMLElement): void {
    if (!target) {
      console.error("Target element is required for observation.");
      return;
    }

    this.targetElement = target;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.onIntersect(); // Calling a colback
          }
        });
      },
      {
        root: this.root, // The element within which scrolling takes place
        threshold: this.threshold, // Visibility threshold
      }
    );

    this.observer.observe(target);
  }

  // Stop the surveillance
  public disconnect(): void {
    if (this.observer && this.targetElement) {
      this.observer.unobserve(this.targetElement);
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// usage

// !!!!!! is added to the place we are going to monitor and whose height is increasing.
// <div ref="scrollContainer" class="overflow-y-auto scrollbar-thin flex flex-col gap-3">

// !!!!!! is added at the LOWEST point of the tracked item
// <!-- Intersection Observer -->
// <div ref="observerTarget" class="h-1"></div>

// !!!!!! use in <script>
// const scrollContainer = ref<HTMLElement | null>(null);
// const observerTarget = ref<HTMLElement | null>(null);
// let observerHelper: IntersectionObserverHelper | null = null;

// if (observerTarget.value && scrollContainer.value) {
// 	console.log("Scroll container height:", scrollContainer.value.scrollHeight);
// 	console.log("Observer target position:", observerTarget.value.offsetTop);

// 	observerHelper = new IntersectionObserverHelper(scrollContainer.value, 0.2, () => {
// 		console.log("Пользователь достиг 80% списка!");
// 	});

// 	observerHelper.observe(observerTarget.value);
// }
