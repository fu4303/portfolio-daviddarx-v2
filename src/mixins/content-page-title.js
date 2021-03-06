export default {
  data() {
    return {
      isTitleHidden: false,
      isTitleBelow: false,
      isTitleJumping: false,
      title: undefined,
      pageTitleInit: undefined,
      observer: undefined,
      observerEntries: undefined,
      observerEntriesActive: undefined,
      observerRootMargin: '0px 0px 0px 0px',
      windowGutter: 0,
      windowW: 0,
      windowH: 0,
      rootMarginTop: 0,
      rootMarginTopRatioToGutter: 0,
      rootMarginBottom: 0,
      rootMarginBottomRatioToGutter: 1,
      isObserverFirstCallFired: false,
      mobileDeactivationMaxWidth: 768,
    }
  },
  methods: {
    initTitlesObserver (pageTitleInit) {
      if (pageTitleInit) {
        this.pageTitleInit = pageTitleInit;
      }

      if (this.getWindowWidth() > this.mobileDeactivationMaxWidth) {
        if (!!window.IntersectionObserver) {
          this.title = document.querySelector('.hidable-title');

          this.calculateRootMargin();

          this.observer = new IntersectionObserver(this.intersectionListener, {
            rootMargin: this.observerRootMargin
          });

          this.observerEntries = document.querySelectorAll('.hiding-title');
          this.observerEntriesActive = [];

          this.observerEntries.forEach((element, i) => {
            element.setAttribute('id', i);
            element.setAttribute('firstCalled', false);
            this.observer.observe(element);
          });
        }
      }

      window.addEventListener('resize', this.resizeTitlesObserver);
    },
    destroyTitlesObserver () {
      if (!!window.IntersectionObserver) {
        this.title = undefined;

        if (this.observerEntries) {
          this.observerEntries.forEach(element => {
            this.observer.unobserve(element);
          });
          this.observerEntries = undefined;
        }

        if (this.observer) {
          this.observer.disconnect();
          this.observer = undefined;
        }

        this.isObserverFirstCallFired = false;
        window.removeEventListener('resize', this.resizeTitlesObserver);
      }
    },
    getWindowWidth () {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      return vw;
    },
    calculateRootMargin () {
      this.windowW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      this.windowH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      this.windowGutter = parseFloat(getComputedStyle(document.body).getPropertyValue('--s-gutter').split('vw')[0])/100;

      this.rootMarginTop = Math.round(this.windowH * this.windowGutter * this.rootMarginTopRatioToGutter);
      this.rootMarginBottom = (this.windowH - Math.round(this.windowH * this.windowGutter + this.title.offsetHeight + this.windowH * this.windowGutter * this.rootMarginBottomRatioToGutter)) * -1;

      this.observerRootMargin = `${this.rootMarginTop}px 0px ${this.rootMarginBottom}px 0px`;
    },
    resizeTitlesObserver () {
      this.destroyTitlesObserver();
      this.initTitlesObserver();
    },
    intersectionListener (entries, observer) {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          this.observerEntriesActive.push(entry.target);

          const isEntryAboveTitle = (entry.boundingClientRect.y < this.windowH * this.windowGutter);

          if (isEntryAboveTitle == true) {
            this.isTitleBelow = true;
          }

          this.isTitleHidden = true;
        } else {
          if (this.observerEntriesActive.indexOf(entry.target) != -1) {
            this.observerEntriesActive.splice(this.observerEntriesActive.indexOf(entry.target), 1);
          }

          const entryID = parseInt(entry.target.getAttribute('id'));
          const isEntryFirstCalled = entry.target.getAttribute('firstCalled') == 'true';
          const isEntryAboveTitle = (entry.boundingClientRect.y < this.windowH * this.windowGutter);

          const targetReplaceTitle = entry.target.getAttribute('titleReplace');
          if (targetReplaceTitle != null && isEntryFirstCalled) {
            if (isEntryAboveTitle == true) {
              this.pageTitle = targetReplaceTitle;
            } else {
              if (entryID == 0) {
                this.pageTitle = this.pageTitleInit;
              } else {
                const previousTitle = this.observerEntries[entryID-1].getAttribute('titleReplace');
                if (previousTitle != null) {
                  this.pageTitle = previousTitle;
                } else {
                  this.pageTitle = this.pageTitleInit;
                }
              }
            }
          } else {
            this.pageTitle = this.pageTitleInit;
          }

          if (this.observerEntriesActive.length == 0) {
            if (isEntryAboveTitle == true) {
              this.isTitleBelow = true;
              this.isTitleJumping = true;
            }

            if (isEntryFirstCalled) {
              requestAnimationFrame(() => {
                this.isTitleHidden = false;
                this.isTitleBelow = false;
                this.isTitleJumping = false;
              });
            }
          }
        }

        entry.target.setAttribute('firstCalled', true);
      });
    },
  }
}
