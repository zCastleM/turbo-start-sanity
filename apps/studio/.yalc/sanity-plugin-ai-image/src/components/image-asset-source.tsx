import {ArrowRightIcon, SearchIcon} from '@sanity/icons'
import {Button, Dialog, Flex, Stack, Text, TextInput, ThemeProvider} from '@sanity/ui'
import {type ChangeEvent, useState} from 'react'

import styled from 'styled-components'

export const SearchInput = styled(TextInput)`
  position: sticky;
  top: 0;
  z-index: 1;
`

type ImageAssetSourceProps = {
  onClose: () => void
  //   onGenerate: () => void
  //   onSelect: (image: any) => void
}

export function ImageAssetSource({onClose}: ImageAssetSourceProps) {
  const [query, setQuery] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value)
  }

  const handleGenerate = () => {
    console.log('query', query)
  }

  return (
    <ThemeProvider>
      <Dialog
        animate
        id="ai-image-asset-source"
        header="Generate image with AI"
        onClose={onClose}
        open
        width={4}
      >
        <Stack space={3} paddingX={4} paddingBottom={4}>
          <Flex flex={1}>
            <SearchInput
              style={{flex: 1}}
              width={'100%'}
              label="Prompt"
              placeholder="Enter a prompt to generate an image"
              icon={SearchIcon}
              clearButton
              value={query}
              onChange={handleInputChange}
            />
            <Button paddingY={0} paddingX={2} onClick={handleGenerate} icon={ArrowRightIcon}>
              <Text>Generate</Text>
            </Button>
          </Flex>
          <Text size={1} muted>
            No results found
          </Text>
          {/* <SearchInput
            clearButton={query.length > 0}
            icon={SearchIcon}
            onChange={this.handleSearchTermChanged}
            onClear={this.handleSearchTermCleared}
            placeholder="Search by topics or colors"
            value={query}
          /> */}
          {/* {!isLoading && this.getPhotos().length === 0 && (
            <Text size={1} muted>
              No results found
            </Text>
          )} */}
          {/* <InfiniteScroll
            dataLength={this.getPhotos().length} // This is important field to render the next data
            next={this.handleScollerLoadMore}
            // scrollableTarget="unsplash-scroller"
            hasMore
            scrollThreshold={0.99}
            height="60vh"
            loader={
              <Flex align="center" justify="center" padding={3}>
                <Spinner muted />
              </Flex>
            }
            endMessage={
              <Text size={1} muted>
                No more results
              </Text>
            }
          > */}
          {/* {searchResults
              .filter((photos) => photos.length > 0)
              .map((photos: UnsplashPhoto[], index) => (
                <PhotoAlbum
                  // eslint-disable-next-line react/no-array-index-key
                  key={`gallery-${query || 'popular'}-${index}`}
                  layout="rows"
                  spacing={PHOTO_SPACING}
                  padding={PHOTO_PADDING}
                  targetRowHeight={(width) => {
                    if (width < 300) return 150
                    if (width < 600) return 200
                    return 300
                  }}
                  photos={photos.map((photo: UnsplashPhoto) => ({
                    src: photo.urls.small,
                    width: photo.width,
                    height: photo.height,
                    key: photo.id,
                    data: photo,
                  }))}
                  renderPhoto={this.renderImage}
                  componentsProps={{
                    containerProps: { style: { marginBottom: `${PHOTO_SPACING}px` } },
                  }}
                />
              ))}
          </InfiniteScroll> */}
        </Stack>
      </Dialog>
    </ThemeProvider>
  )
}
