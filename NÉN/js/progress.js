function startCompressProgressPoll(taskId, cb) {
    return setInterval(async () => {
        try {
            const res = await fetch('/api/get-progress?id=' + taskId);
            if (res.ok) cb(await res.json());
        } catch(e) {}
    }, 500);
}