export default function() {
  this.transition(
    this.onInitialRender(),
    this.use('fade')
  );
}
