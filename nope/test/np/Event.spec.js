describe('np.Event', () => {
  var Event = np.require('np.Event'),
      event;

  beforeEach(() => {
    event = new Event();
  });

  describe('.empty', () => {
    it('is a frozen object', () => {
      expect(Object.isFrozen(Event.empty)).toBe(true);
    });
    it('is an empty object', () => {
      expect(Object.keys(Event.empty).length).toBe(0);
    });
  });

  describe('ctor', () => {
    it('creates an instance of np.Event', () => {
      expect(event instanceof Event).toBe(true);
    });
    it('creates an empty instance', () => {
      expect(event.length).toBe(0);
    });
  });

  describe('#raise', () => {
    it('invokes all registered listeners', () => {
      var listenerA = jasmine.createSpy(),
          listenerB = jasmine.createSpy(),
          listenerC = jasmine.createSpy(),
          removeA,
          removeB,
          removeC;

      event.raise();
      removeA = event.on(listenerA);
      event.raise();
      removeB = event.on(listenerB);
      event.raise();
      removeC = event.on(listenerC);
      event.raise();
      removeC();
      event.raise();
      removeB();
      event.raise();
      removeA();
      event.raise();

      expect(listenerA.calls.count).toBe(5);
      expect(listenerB.calls.count).toBe(3);
      expect(listenerC.calls.count).toBe(1);
    });
    it('invokes listeners with the event arguments and the source object', () => {
      var listener = jasmine.createSpy(),
          source = {},
          args = {},
          event = new Event(source);

      event.on(listener);
      event.raise(args);

      expect(listener.calls.mostRecent().args[0]).toBe(args);
      expect(listener.calls.mostRecent().args[1]).toBe(source);
    });
  });

  describe('#on', () => {
    it('adds an event listener to the event', () => {
      event.on(() => true);
      expect(event.length).toBe(1);
    });
    it('binds the event listener which is bound to the context argument', () => {
      var listener = jasmine.createSpy(),
          context = {};
      event.on(listener, context);
      event.raise();
      expect(listener.calls.mostRecent().object).toBe(context);
    });
    it('returns a function which removes the listener', () => {
      event.on(() => true)();
      expect(event.length).toBe(0);
    });
  });

  describe('#dispose', () => {
    it('should remove all listeners', () => {
      event.on(jasmine.createSpy());
      event.on(jasmine.createSpy());
      event.on(jasmine.createSpy());

      event.dispose();

      expect(event.length).toBe(0);
    });
  });
});
