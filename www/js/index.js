function downloadFile() {
    window.requestFileSystem(
        LocalFileSystem.PERSISTENT, 0,
        function onFileSystemSuccess(fileSystem) {
            fileSystem.root.getFile(
                "dummy.html", { create: true, exclusive: false },
                function gotFileEntry(fileEntry) {
                    var sPath = fileEntry.fullPath.replace("dummy.html", "");
                    var fileTransfer = new FileTransfer();
                    fileEntry.remove();

                    fileTransfer.download(
                        "http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3",
                        sPath + "theFile.pdf",
                        function (theFile) {
                            console.log("download complete: " + theFile.toURI());
                            showLink(theFile.toURI());
                        },
                        function (error) {
                            console.log("download error source " + error.source);
                            console.log("download error target " + error.target);
                            console.log("upload error code: " + error.code);
                        }
                    );
                },
                fail);
        },
        fail);

}

function fail(evt) {
    console.log(evt.target.error.code);
}
