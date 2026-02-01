// alert("SuccessFully!");
class DraggableMarquee {
        constructor(elementId, speed, delayTime, direction, cardWidth, totalCards, gap) {
          this.track = document.querySelector(elementId);
          this.speed = speed;
          this.direction = direction;

          this.cardWidth = cardWidth + gap;//370
          this.totalCards = totalCards;//4
          this.singleSetWidth = this.cardWidth * this.totalCards; //370 x 4 = 1480
          this.pos = direction === 1 ? -this.singleSetWidth : 0;

          // --- State (ដាច់ដោយឡែកសម្រាប់ Track នីមួយៗ) ---
          this.isDragging = false;//user not scroll
          this.isHovering = false;//mouse not on
          this.isWaiting = false; // សម្រាប់ Delay

          this.resumeTimeout = null;
          this.delayTime = delayTime;

          this.startX = 0;
          this.lastX = 0;

          this.initEvents();
          this.animate();
        }

        // Function ចាប់ផ្តើមរាប់ថយក្រោយ
        triggerResumeDelay() {
          if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
          this.isWaiting = true;

          this.resumeTimeout = setTimeout(() => {
            // ត្រួតពិនិត្យតែលើ Object នេះប៉ុណ្ណោះ
            if (!this.isHovering && !this.isDragging) {
              this.isWaiting = false;
            }
          }, this.delayTime);
        }

        initEvents() {
          // --- Mouse & Touch (Drag) ---
          const start = (x) => {
            this.isDragging = true;
            this.startX = x;
            this.lastX = x;
            this.track.style.cursor = "grabbing";

            if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
            this.isWaiting = false;
          };

          const move = (x) => {
            // ប្រសិនបើ Object នេះមិនត្រូវបានគេ Drag ទេ កុំធ្វើអី (ការពារកុំឲ្យប៉ះ Track ផ្សេង)
            if (!this.isDragging) return;

            const delta = x - this.lastX;
            this.pos += delta;
            this.lastX = x;
          };

          const end = () => {
            // ធ្វើការតែលើ Object ដែលកំពុង Drag
            if (!this.isDragging) return;

            this.isDragging = false;
            this.track.style.cursor = "grab";
            this.triggerResumeDelay();
          };

          // Event Listeners ដាក់លើ Track ផ្ទាល់ (សម្រាប់ Start)
          this.track.addEventListener("mousedown", (e) => start(e.clientX));
          this.track.addEventListener("touchstart", (e) =>
            start(e.touches[0].clientX),
          );

          // Event Listeners ដាក់លើ Window (សម្រាប់ Move/End) ដើម្បីអោយអូសចេញក្រៅបាន
          // សំគាល់៖ function move និង end នឹង check `this.isDragging` មុននឹងធ្វើការ
          window.addEventListener("mousemove", (e) => move(e.clientX));
          window.addEventListener("mouseup", end);

          window.addEventListener("touchmove", (e) =>
            move(e.touches[0].clientX),
          );
          window.addEventListener("touchend", end);

          // --- Hover (Pause) ---
          // ដោយសារយើងប្រើ this.track ដូច្នេះវាប៉ះពាល់តែ Track មួយហ្នឹងប៉ុណ្ណោះ
          this.track.addEventListener("mouseenter", () => {
            this.isHovering = true;
            if (this.resumeTimeout) clearTimeout(this.resumeTimeout);
          });

          this.track.addEventListener("mouseleave", () => {
            this.isHovering = false;
            if (!this.isDragging) {
              this.triggerResumeDelay();
            }
          });
        }

        animate() {
          // Check state ផ្ទាល់ខ្លួនរបស់ Object នេះ
          if (!this.isDragging && !this.isHovering && !this.isWaiting) {
            this.pos += this.speed * this.direction; //this.pos = 1or-1480 * 0.2 * 1or-1; 
          }

          // Infinite Loop Logic
          if (this.pos <= -this.singleSetWidth) {
            this.pos += this.singleSetWidth;
          }
          if (this.pos > 0) {
            this.pos -= this.singleSetWidth;
          }

          this.track.style.transform = `translateX(${this.pos}px)`;
          requestAnimationFrame(this.animate.bind(this));
        }
      }

export default DraggableMarquee;