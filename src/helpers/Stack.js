export function Stack(initial=[]) {
    this.list = initial

    this.push = (x) => {
        this.list.push(x);
    }

    this.pop = () => {
        return this.list.pop();
    }

    this.last = () => {
        if(this.list.length > 0) {
            return this.list[this.list.length - 1];
        } else {
            return null;
        }
    }

    this.length = () => {
        return this.list.length;
    }
}