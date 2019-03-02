<script>
import cell from '../mixins/cell/cell';

export default {
    name: 'VueAdsCell',

    mixins: [
        cell,
    ],

    render (createElement) {
        return createElement('td', {
            class: this.cellClasses,
            style: this.style,
        }, [
            createElement('span', {
                class: this.titleClasses,
                on: this.clickEvents,
            }, this.value(createElement)),
        ]);
    },
};
</script>
