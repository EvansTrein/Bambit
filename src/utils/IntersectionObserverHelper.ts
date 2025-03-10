export class IntersectionObserverHelper {
  private observer: IntersectionObserver | null = null;
  private targetElement: HTMLElement | null = null;

  constructor(
    private root: HTMLElement | null = null,
    private threshold: number, // Порог видимости 
    private onIntersect: () => void // Колбэк при пересечении
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
            this.onIntersect(); // Вызываем колбэк
          }
        });
      },
      {
        root: this.root, // Элемент, внутри которого происходит прокрутка
        threshold: this.threshold, // Порог видимости
      }
    );

    this.observer.observe(target);
  }

  // Остановить наблюдение
  public disconnect(): void {
    if (this.observer && this.targetElement) {
      this.observer.unobserve(this.targetElement);
      this.observer.disconnect();
      this.observer = null;
    }
  }
}


// использование 

// !!!!!! добавляется на то место за которым будем следить и у которого РАСТЕТ высота
// <div ref="scrollContainer" class="overflow-y-auto scrollbar-thin flex flex-col gap-3">

// !!!!!! добавляется в САМОМ НИЗУ отслеживаемого элемента
// <!-- Intersection Observer -->
// <div ref="observerTarget" class="h-1"></div>


// !!!!!! использование в <script>
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